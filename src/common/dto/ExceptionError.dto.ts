import { ApiProperty } from '@nestjs/swagger';

export class ExceptionErrorDto {
  @ApiProperty({
    example: false,
    description: '성공여부',
    required: true,
  })
  public success: boolean;
  @ApiProperty({
    example: 400,
    description: '에러코드',
    required: true,
  })
  public statusCode: number;
  @ApiProperty({
    example: ['Error1', 'Error2'],
    description: '에러 메시지',
    required: true,
  })
  public message: string[];
}
