import { PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ChannelChats } from 'src/entities/ChannelChats';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';

export class CreateChannelDto extends PickType(Channels, ['name']) {
  @IsString({ message: '채널명은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '채널명은 필수 입력 항목입니다.' })
  public name: string;
}

export class InviteChannelDto extends PickType(Users, ['email']) {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  public email: string;
}

export class CreateChatDto extends PickType(ChannelChats, ['content']) {
  @IsString({ message: '메시지는 문자열 이어야 합니다.' })
  @IsNotEmpty({ message: '메시지는 필수 입력 항목입니다.' })
  public content: string;
}
