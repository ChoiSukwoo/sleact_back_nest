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

@Index('dms_ibfk_3', ['receiverId'], {})
@Index('dms_ibfk_2', ['senderId'], {})
@Index('WorkspaceId', ['workspaceId'], {})
@Entity('dms', { schema: 'sleact' })
export class Dms {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ example: 1, description: 'DM의 ID', required: true })
  id: number;

  @Column('text', { name: 'content' })
  @ApiProperty({
    example: '안녕하세요',
    description: 'DM의 내용',
    required: true,
  })
  content: string;

  @Column('datetime', { name: 'createdAt', default: () => 'current_timestamp' })
  createdAt: Date;

  @Column('datetime', { name: 'updatedAt', default: () => 'current_timestamp' })
  updatedAt: Date;

  @Column('int', { name: 'WorkspaceId', nullable: true })
  @ApiProperty({
    example: 123,
    description: '워크스페이스의 ID',
    required: true,
  })
  workspaceId: number | null;

  @Column('int', { name: 'SenderId', nullable: true })
  @ApiProperty({
    example: 456,
    description: '보낸 사용자의 ID',
    required: true,
  })
  senderId: number | null;

  @Column('int', { name: 'ReceiverId', nullable: true })
  @ApiProperty({
    example: 789,
    description: '받은 사용자의 ID',
    required: true,
  })
  receiverId: number | null;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.dms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }])
  workspace: Workspaces;

  @ManyToOne(() => Users, (users) => users.dms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }])
  receiver: Users;

  @ManyToOne(() => Users, (users) => users.dms2, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }])
  sender: Users;
}
