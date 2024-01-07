import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/Channelmembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/Workspacemembers';
import { Workspaces } from 'src/entities/Workspaces';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspaceRepository: Repository<Workspaces>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMemberRepository: Repository<WorkspaceMembers>,
    @InjectRepository(Channels)
    private channelRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMemberRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  async findById(id: number) {
    return this.workspaceRepository.findOne({ where: { id } });
  }
  async findMyWorkspaces(myId: number) {
    return this.workspaceRepository.find({
      where: {
        workspacemembers: [{ userId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //워크스페이스 생성
      const workspace = await queryRunner.manager
        .getRepository(Workspaces)
        .save({
          name,
          url,
          ownerId: myId,
        });

      //워크스페이스에 자신을 맴버로 추가
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        userId: myId,
        workspaceId: workspace.id,
      });

      //채널 추가
      const channel = await queryRunner.manager.getRepository(Channels).save({
        name: '일반',
        workspaceId: workspace.id,
      });

      //채널에 자신을 맴버로 추가
      await queryRunner.manager.getRepository(ChannelMembers).save({
        userId: myId,
        channelId: channel.id,
      });

      //트렌젝션 적용
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMembers(url: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.workspaceMembers', 'workspaceMembers')
      .leftJoin('workspaceMembers.workspace', 'workspace')
      .where('workspace.url = :url', { url })
      .andWhere('workspaceMembers.deletedAt IS NULL') // Exclude users with deleted membership
      .getMany();
  }

  async kickMemberFromWorkspace(url: string, memberId: number) {
    // 특정 URL에 해당하는 워크스페이스를 조회합니다.
    const workspace = await this.workspaceRepository.findOne({
      where: { url },
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.channels',
        },
      },
    });

    // 특정 ID에 해당하는 사용자를 조회합니다.
    const user = await this.userRepository.findOne({ where: { id: memberId } });

    // 워크스페이스 또는 사용자가 존재하지 않으면 예외를 던집니다.
    if (!workspace) {
      throw new NotFoundException('워크스페이스 정보를 찾을 수 없습니다.');
    }
    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 워크스페이스 멤버를 삭제합니다.
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        workspaceId: workspace.id,
        userId: user.id,
        deletedAt: new Date(),
      });

      // 워크스페이스의 모든 채널에서 해당 사용자를 삭제합니다.
      for (const channel of workspace.channels) {
        await queryRunner.manager.getRepository(ChannelMembers).save({
          channelId: channel.id,
          userId: user.id,
          deletedAt: new Date(),
        });
      }

      //트렌젝션 적용
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createWorkspaceMembers(url, email) {
    const workspace = await this.workspaceRepository.findOne({
      where: { url },
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.channels',
        },
      },
    });
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('workspace : ', workspace, 'user : ', user);
    if (!workspace) {
      throw new NotFoundException('워크스테이션 정보를 찾을수 없습니다.');
    }
    if (!user) {
      throw new NotFoundException('유저정보를 찾을수 없습니다.');
    }
    await this.workspaceMemberRepository.save({
      workspaceId: workspace.id,
      userId: user.id,
    });

    await this.channelMemberRepository.save({
      channelId: workspace.channels.find((v) => v.name === '일반').id,
      userId: user.id,
    });
  }

  async getWorkspaceMember(url: string, id: number): Promise<any | false> {
    const member = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.workspaceMembers', 'workspaceMembers')
      .leftJoin('workspaceMembers.workspace', 'workspace')
      .where('user.id = :id', { id })
      .andWhere('workspace.url = :url', { url })
      .andWhere('workspaceMembers.deletedAt IS NULL')
      .getOne();

    return member || false; // 결과가 없으면 false 반환
  }
}
