import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDto } from '../../users/dto/join.request.dto';

export class UserDto extends JoinRequestDto {
  @ApiProperty({
    example: 'id123',
    description: '아이디',
    required: true,
  })
  public id: number;
}
