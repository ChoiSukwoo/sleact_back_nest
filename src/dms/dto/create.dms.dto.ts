import { PickType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { ChannelChats } from 'src/entities/Channelchats';

export class CreateChatDto extends PickType(ChannelChats, ['content']) {
  @IsString({ message: '메시지는 문자열 이어야 합니다.' })
  @IsNotEmpty({ message: '메시지는 필수 입력 항목입니다.' })
  public content: string;
}
