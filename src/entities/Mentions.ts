import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Import the ApiProperty decorator
import { Workspaces } from './Workspaces';
import { Users } from './Users';

@Index('ReceiverId', ['receiverId'], {})
@Index('SenderId', ['senderId'], {})
@Index('WorkspaceId', ['workspaceId'], {})
@Entity('mentions', { schema: 'sleact' })
export class Mentions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ example: 1, description: '언급의 ID', required: true })
  id: number;

  @Column('enum', { name: 'category', enum: ['chat', 'dm', 'system'] })
  @ApiProperty({
    example: 'chat',
    description: '언급의 카테고리(chat, dm, system)',
    required: true,
  })
  category: 'chat' | 'dm' | 'system';

  @Column('int', { name: 'ChatId', nullable: true })
  @ApiProperty({ example: 123, description: '채팅의 ID', required: true })
  chatId: number | null;

  @Column('datetime', {
    name: 'createdAt',
    default: () => 'current_timestamp',
  })
  createdAt: Date;

  @Column('datetime', { name: 'updatedAt', default: () => 'current_timestamp' })
  updatedAt: Date;

  @Column('int', { name: 'WorkspaceId', nullable: true })
  @ApiProperty({
    example: 456,
    description: '워크스페이스의 ID',
    required: true,
  })
  workspaceId: number | null;

  @Column('int', { name: 'SenderId', nullable: true })
  @ApiProperty({
    example: 789,
    description: '보낸 사용자의 ID',
    required: true,
  })
  senderId: number | null;

  @Column('int', { name: 'ReceiverId', nullable: true })
  @ApiProperty({
    example: 101112,
    description: '받은 사용자의 ID',
    required: true,
  })
  receiverId: number | null;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }])
  workspace: Workspaces;

  @ManyToOne(() => Users, (users) => users.mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }])
  receiver: Users;

  @ManyToOne(() => Users, (users) => users.mentions2, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }])
  sender: Users;
}
