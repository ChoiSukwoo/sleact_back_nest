import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelChats } from 'src/entities/ChannelChats';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private dataSource: DataSource,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoin(
        'channels.channelmembers',
        'channelMembers',
        'channelMembers.userId = :myId',
        { myId },
      )
      .innerJoin('channels.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channels.deletedAt IS NULL')
      .andWhere('channelMembers.deletedAt IS NULL')
      .getMany();
  }

  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoin('channels.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channels.name = :name', { name })
      .where('channels.deletedAt IS NULL')
      .getOne();
  }

  //채널생성
  async createWorkspaceChannels(url: string, name: string, myId: number) {
    //워크스페이스 찾기
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });

    if (!workspace) {
      throw new NotFoundException('워크스테이션 정보를 찾을수 없습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //신규 채널 추가
      const newChannel = await queryRunner.manager
        .getRepository(Channels)
        .save({
          name,
          workspaceId: workspace.id,
        });

      //신규 채널에 맴버로 자신 추가
      await queryRunner.manager.getRepository(ChannelMembers).save({
        userId: myId,
        channelId: newChannel.id,
      });

      //트렌젝션 적용
      await queryRunner.commitTransaction();
      return newChannel;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.channels', 'channels', 'channels.name = :name', {
        name,
      })
      .innerJoin('channels.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany();
  }

  async createWorkspaceChannelMembers(url, name, email) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    if (!channel) {
      throw new NotFoundException('채널 정보를 찾을수 없습니다.');
    }
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .innerJoin('user.workspaces', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getOne();
    if (!user) {
      throw new NotFoundException('유저 정보를 찾을수 없습니다.');
    }

    await this.channelMembersRepository.save({
      channelId: channel.id,
      userId: user.id,
    });
    return true;
  }

  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    console.log('perPage : ', perPage, 'page : ', page);

    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChats.channel', 'channel', 'channel.name = :name', {
        name,
      })
      .innerJoin('channel.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .innerJoinAndSelect('channelChats.user', 'user')
      .orderBy('channelChats.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async getChannelUnreadsCount(url, name, after) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();

    return this.channelChatsRepository.count({
      where: {
        channelId: channel.id,
        createdAt: MoreThan(new Date(after)),
      },
    });
  }

  async createWorkspaceChannelChats(
    url: string,
    name: string,
    content: string,
    myId: number,
  ) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException('채널 정보를 찾을수 없습니다.');
    }

    const savedChat = await this.channelChatsRepository.save({
      content,
      userId: myId,
      channelId: channel.id,
    });

    this.eventsGateway.server
      // .of(`/ws-${url}`)
      .to(`/ws-${url}-${channel.id}`)
      .emit('message', savedChat);
  }

  async createWorkspaceChannelImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    myId: number,
  ) {
    console.log(files);

    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException('채널 정보를 찾을수 없습니다.');
    }

    for (let i = 0; i < files.length; i++) {
      const savedChat = await this.channelChatsRepository.save({
        content: files[i].path,
        userId: myId,
        channelId: channel.id,
      });

      this.eventsGateway.server
        // .of(`/ws-${url}`)
        .to(`/ws-${url}-${channel.id}`)
        .emit('message', savedChat);
    }
  }
}
