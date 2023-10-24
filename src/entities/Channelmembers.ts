import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Import the ApiProperty decorator
import { Users } from './Users';
import { Channels } from './Channels';

@Index('UserId', ['userId'], {})
@Index('IDX_3446cc443ce59a7f7ae62acc16', ['userId'], {})
@Index('IDX_e53905ed6170fb65083051881e', ['channelId'], {})
@Entity('channelmembers', { schema: 'sleact' })
export class ChannelMembers {
  @Column('int', { primary: true, name: 'ChannelId' })
  @ApiProperty({ example: 123, description: '채널의 ID', required: true })
  channelId: number;

  @Column('int', { primary: true, name: 'UserId' })
  @ApiProperty({ example: 456, description: '사용자의 ID', required: true })
  userId: number;

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

  @ManyToOne(() => Users, (users) => users.channelMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: Users;

  @ManyToOne(() => Channels, (channels) => channels.channelmembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }])
  channel: Channels;
}
