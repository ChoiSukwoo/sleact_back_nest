import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Import the ApiProperty decorator
import { Channels } from './Channels';
import { Dms } from './Dms';
import { Mentions } from './Mentions';
import { Workspacemembers } from './Workspacemembers';
import { Users } from './Users';

@Index('url', ['url'], { unique: true })
@Index('name', ['name'], { unique: true })
@Index('IDX_de659ece27e93d8fe29339d0a4', ['name'], { unique: true })
@Index('IDX_22a04f0c0bf6ffd5961a28f5b7', ['url'], { unique: true })
@Index('OwnerId', ['ownerId'], {})
@Entity('workspaces', { schema: 'sleact' })
export class Workspaces {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ example: 1, description: '워크스페이스의 ID', required: true })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 30 })
  @ApiProperty({
    example: 'my_workspace',
    description: '워크스페이스 이름',
    required: true,
  })
  name: string;

  @Column('varchar', { name: 'url', unique: true, length: 30 })
  @ApiProperty({
    example: 'my-workspace',
    description: '워크스페이스 URL',
    required: true,
  })
  url: string;

  @Column('datetime', { name: 'createdAt', default: () => 'current_timestamp' })
  createdAt: Date;

  @Column('datetime', { name: 'updatedAt', default: () => 'current_timestamp' })
  updatedAt: Date;

  @Column('datetime', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @Column('int', { name: 'OwnerId', nullable: true })
  @ApiProperty({
    example: 123,
    description: '워크스페이스 소유자의 ID',
    required: true,
  })
  ownerId: number | null;

  @OneToMany(() => Channels, (channels) => channels.workspace)
  channels: Channels[];

  @OneToMany(() => Dms, (dms) => dms.workspace)
  dms: Dms[];

  @OneToMany(() => Mentions, (mentions) => mentions.workspace)
  mentions: Mentions[];

  @OneToMany(
    () => Workspacemembers,
    (workspacemembers) => workspacemembers.workspace,
  )
  workspacemembers: Workspacemembers[];

  @ManyToOne(() => Users, (users) => users.workspaces, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }])
  owner: Users;
}
