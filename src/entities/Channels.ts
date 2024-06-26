import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Import the ApiProperty decorator
import { ChannelChats } from './Channelchats';
import { ChannelMembers } from './Channelmembers';
import { Workspaces } from './Workspaces';
import { Users } from './Users';

@Index('WorkspaceId', ['workspaceId'], {})
@Entity('channels', { schema: 'sleact' })
export class Channels {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ example: 1, description: '채널의 ID', required: true })
  id: number;

  @Column('varchar', { name: 'name', length: 30 })
  @ApiProperty({
    example: 'general',
    description: '채널의 이름',
    required: true,
  })
  name: string;

  @Column('tinyint', {
    name: 'private',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  @ApiProperty({
    example: false,
    description: '채널의 공개 여부',
    required: true,
  })
  private: boolean | null;

  @Column('datetime', { name: 'createdAt', default: () => 'current_timestamp' })
  createdAt: Date;

  @Column('datetime', { name: 'updatedAt', default: () => 'current_timestamp' })
  updatedAt: Date;

  @Column('datetime', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @Column('int', { name: 'WorkspaceId', nullable: true })
  @ApiProperty({
    example: 123,
    description: '워크스페이스의 ID',
    required: true,
  })
  workspaceId: number | null;

  @OneToMany(() => ChannelChats, (channelchats) => channelchats.channel)
  channelchats: ChannelChats[];

  @OneToMany(() => ChannelMembers, (channelmembers) => channelmembers.channel)
  channelmembers: ChannelMembers[];

  @ManyToMany(() => Users, (users) => users.channels)
  members: Users[];

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.channels, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }])
  workspace: Workspaces;
}
