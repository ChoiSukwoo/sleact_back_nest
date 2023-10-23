import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Import the ApiProperty decorator
import { Users } from './Users';
import { Workspaces } from './Workspaces';

@Index('UserId', ['userId'], {})
@Index('IDX_1f3af49b8195937f52d3a66e56', ['userId'], {})
@Index('IDX_77afc26dfe5a8633e6ce35eaa4', ['workspaceId'], {})
@Entity('workspacemembers', { schema: 'sleact' })
export class Workspacemembers {
  @Column('int', { primary: true, name: 'WorkspaceId' })
  @ApiProperty({ example: 1, description: '워크스페이스의 ID', required: true })
  workspaceId: number;

  @Column('int', { primary: true, name: 'UserId' })
  @ApiProperty({ example: 123, description: '사용자의 ID', required: true })
  userId: number;

  @Column('datetime', { name: 'createdAt', default: () => 'current_timestamp' })
  createdAt: Date;

  @Column('datetime', { name: 'updatedAt', default: () => 'current_timestamp' })
  updatedAt: Date;

  @Column('datetime', { name: 'loggedInAt', nullable: true })
  loggedInAt: Date | null;

  @ManyToOne(() => Users, (users) => users.workspacemembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: Users;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.workspacemembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }])
  workspace: Workspaces;
}
