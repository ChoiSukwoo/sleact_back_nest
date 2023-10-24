import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class JoinRequestDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  @ApiProperty({
    example: 'email@naver.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '닉네임은 필수 입력 항목입니다.' })
  @MinLength(3, { message: '닉네임은 최소 3글자 이상이어야 합니다.' })
  @ApiProperty({
    example: 'niena',
    description: '닉네임',
    required: true,
  })
  public nickname: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  @MinLength(6, { message: '비밀번호는 최소 6글자 이상이어야 합니다.' })
  @ApiProperty({
    example: 'password123',
    description: '비밀번호',
    required: true,
  })
  public password: string;
}
