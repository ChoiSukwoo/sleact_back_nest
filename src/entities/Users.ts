import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Import the ApiProperty decorator
import { Channelchats } from './Channelchats';
import { Channelmembers } from './Channelmembers';
import { Dms } from './Dms';
import { Mentions } from './Mentions';
import { Workspacemembers } from './Workspacemembers';
import { Workspaces } from './Workspaces';

@Index('email', ['email'], { unique: true })
@Index('IDX_97672ac88f789774dd47f7c8be', ['email'], { unique: true })
@Entity('users', { schema: 'sleact' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ example: 1, description: '사용자의 ID', required: true })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일',
    required: true,
  })
  email: string;

  @Column('varchar', { name: 'nickname', length: 30 })
  @ApiProperty({
    example: 'john_doe',
    description: '사용자 닉네임',
    required: true,
  })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100, select: false })
  @ApiProperty({
    example: 'hashed_password',
    description: '사용자 비밀번호',
    required: true,
  })
  password: string;

  @Column('datetime', { name: 'createdAt', default: () => 'current_timestamp' })
  createdAt: Date;

  @Column('datetime', {
    name: 'updatedAt',
    default: () => 'current_timestamp',
  })
  updatedAt: Date;

  @Column('datetime', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Channelchats, (channelchats) => channelchats.user)
  channelchats: Channelchats[];

  @OneToMany(() => Channelmembers, (channelmembers) => channelmembers.user)
  channelmembers: Channelmembers[];

  @OneToMany(() => Dms, (dms) => dms.receiver)
  dms: Dms[];

  @OneToMany(() => Dms, (dms) => dms.sender)
  dms2: Dms[];

  @OneToMany(() => Mentions, (mentions) => mentions.receiver)
  mentions: Mentions[];

  @OneToMany(() => Mentions, (mentions) => mentions.sender)
  mentions2: Mentions[];

  @OneToMany(
    () => Workspacemembers,
    (workspacemembers) => workspacemembers.user,
  )
  workspacemembers: Workspacemembers[];

  @OneToMany(() => Workspaces, (workspaces) => workspaces.owner)
  workspaces: Workspaces[];
}
