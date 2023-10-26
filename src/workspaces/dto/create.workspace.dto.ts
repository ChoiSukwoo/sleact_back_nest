import { PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';

export class CreateWorkspaceDto extends PickType(Workspaces, ['name', 'url']) {
  @IsString({ message: '워크스페이스명은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '워크스페이스명은 필수 입력 항목입니다.' })
  public name: string;

  @IsString({ message: 'url은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'url은 필수 입력 항목입니다.' })
  public url: string;
}

export class CreateWorkspaceMemberDto extends PickType(Users, ['email']) {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  public email: string;
}
