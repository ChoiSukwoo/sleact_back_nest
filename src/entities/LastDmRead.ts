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

  @Column('varchar', { name: 'workspaceName', length: 30 })
  @ApiProperty({
    example: 'general',
    description: '워크스페이스의 이름',
    required: true,
  })
  workspaceName: string;

  @Column('int', { name: 'otherId' })
  @ApiProperty({
    example: 456,
    description: '상대방 ID',
    required: true,
  })
  otherId: number;

  @Column('bigint', { name: 'time', default: () => 'UNIX_TIMESTAMP()' })
  @ApiProperty({
    example: 1672531200,
    description: '마지막으로 읽은 시간 (Unix Timestamp)',
    required: true,
  })
  time: number;
}
