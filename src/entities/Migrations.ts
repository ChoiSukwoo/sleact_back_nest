import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Import the ApiProperty decorator

@Entity('migrations', { schema: 'sleact' })
export class Migrations {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @ApiProperty({ example: 1, description: 'Migration ID', required: true })
  id: number;

  @Column('bigint', { name: 'timestamp' })
  @ApiProperty({
    example: '1634899720000',
    description: 'Timestamp of the migration',
    required: true,
  })
  timestamp: string;

  @Column('varchar', { name: 'name', length: 255 })
  @ApiProperty({
    example: 'migration_name',
    description: 'Name of the migration',
    required: true,
  })
  name: string;
}
