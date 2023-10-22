import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspaces/:url/dms')
export class DmsController {
  //:workspace 내부의 :id와 나눈 dm을 가져옴
  @Get(':id/chats')
  getChat(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.url, param.id);
  }

  //:workspace 내부의 :id가 보낸 안 읽은 채팅 수를 가져옴.
  @Get(':id/unreads')
  getUnread(@Query() query, @Param() param) {
    console.log(query.after);
    console.log(param.url, param.id);
  }

  //:workspace 내부의 :id와 나눈 dm을 저장
  @Post(':id/chats')
  postChat(@Body() body, @Param() param) {
    console.log(param.url, param.id);
    console.log(body.content);
  }

  //:workspace 내부의 :id에게 보낸 이미지 저장
  @Post(':id/images')
  postImage(@Body() body, @Param() param) {
    console.log(param.url, param.id);
    console.log(body.image);
  }
}
