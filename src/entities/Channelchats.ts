import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Import the ApiProperty decorator
import { Channels } from './Channels';
import { Users } from './Users';

@Index('ChannelId', ['channelId'], {})
@Index('UserId', ['userId'], {})
@Entity('channelchats', { schema: 'sleact' })
export class ChannelChats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ example: 1, description: '채널 채팅의 ID', required: true })
  id: number;

  @Column('text', { name: 'content' })
  @ApiProperty({
    example: '안녕하세요',
    description: '채널 채팅의 내용',
    required: true,
  })
  content: string;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'current_timestamp',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updatedAt',
    default: () => 'current_timestamp',
  })
  updatedAt: Date;

  @Column('int', { name: 'UserId', nullable: true })
  @ApiProperty({ example: 123, description: '사용자의 ID', required: true })
  userId: number | null;

  @Column('int', { name: 'ChannelId', nullable: true })
  @ApiProperty({ example: 456, description: '채널의 ID', required: true })
  channelId: number | null;

  @ManyToOne(() => Channels, (channels) => channels.channelchats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }])
  channel: Channels;

  @ManyToOne(() => Users, (users) => users.channelchats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: Users;
}
