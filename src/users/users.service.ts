import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { InjectRepository } from '@nestjs/typeorm';
import { LastChannelRead } from 'src/entities/LastChannelRead';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(LastChannelRead)
    private lastReadRepository: Repository<LastChannelRead>,
    private dataSource: DataSource,
  ) {}

  getUser() {}

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });

    // 동일 이메일의 유저가 존재하는지 확인
    if (user) {
      throw new ForbiddenException('이미 존재하는 사용자입니다');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      //유저 생성
      const returned = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });

      //워크스페이스에 멤버로 추가
      const workspaceMember = queryRunner.manager
        .getRepository(WorkspaceMembers)
        .create();
      workspaceMember.userId = returned.id;
      workspaceMember.workspaceId = 1;
      await queryRunner.manager
        .getRepository(WorkspaceMembers)
        .save(workspaceMember);

      //채널에 맴버로 추가
      await queryRunner.manager.getRepository(ChannelMembers).save({
        userId: returned.id,
        channelId: 1,
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

  async setChannelLastRead(
    uid: number,
    workspaceId: number,
    channelId: number,
    time: Date,
  ) {
    const record = await this.lastReadRepository.findOne({
      where: { uid, workspaceId, channelId },
    });

    if (record) {
      record.time = time;
      return this.lastReadRepository.save(record);
    } else {
      const newRecord = this.lastReadRepository.create({
        uid,
        workspaceId,
        channelId,
        time,
      });
      return this.lastReadRepository.save(newRecord);
    }
  }

  async getChannelLastRead(
    uid: number,
    workspaceId: number,
    channelId: number,
  ) {
    const record = await this.lastReadRepository.findOne({
      where: { uid, workspaceId, channelId },
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

  async setDmLastRead(
    uid: number,
    workspaceId: number,
    channelId: number,
    time: Date,
  ) {
    const record = await this.lastReadRepository.findOne({
      where: { uid, workspaceId, channelId },
    });

    if (record) {
      record.time = time;
      return this.lastReadRepository.save(record);
    } else {
      const newRecord = this.lastReadRepository.create({
        uid,
        workspaceId,
        channelId,
        time,
      });
      return this.lastReadRepository.save(newRecord);
    }
  }

  async getDmLastRead(uid: number, workspaceId: number, channelId: number) {
    const record = await this.lastReadRepository.findOne({
      where: { uid, workspaceId, channelId },
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }
}
