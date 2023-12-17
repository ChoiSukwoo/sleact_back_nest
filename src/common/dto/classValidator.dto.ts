import { ApiProperty } from '@nestjs/swagger';

export class classValidatorErrorDto {
  @ApiProperty({
    example: 'Error',
    description: '에러',
    required: true,
  })
  public error: string;
  @ApiProperty({
    example: 400,
    description: '에러코드',
    required: true,
  })
  public statusCode: 400;
  @ApiProperty({
    example: ['Error1', 'Error2'],
    description: '에러 메시지',
    required: true,
  })
  public message: string[];
}
