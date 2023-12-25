import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('lastDmRead', { schema: 'sleact' })
export class LastDmRead {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ example: 1, description: '고유 식별자', required: true })
  id: number;

  @Column('int', { name: 'uid' })
  @ApiProperty({ example: 123, description: '유저의 ID', required: true })
  uid: number;

  @Column('int', { name: 'workspaceId' })
  @ApiProperty({
    example: 456,
    description: '워크스페이스의 ID',
    required: true,
  })
  workspaceId: number;

  @Column('int', { name: 'otherId' })
  @ApiProperty({
    example: 456,
    description: '상대방 ID',
    required: true,
  })
  otherId: number;

  @Column('datetime', { name: 'time', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: '마지막으로 읽은 시간',
    required: true,
  })
  time: Date;
}
