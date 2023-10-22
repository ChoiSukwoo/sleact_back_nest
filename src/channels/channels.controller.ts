import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Channel')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  @ApiOperation({
    summary: ':workspace 내부의 내가 속해있는 채널 리스트를 가져옴',
  })
  @Get()
  getAllChannels(@Param() param) {
    console.log(param.url);
  }
  //----------------------------
  @ApiOperation({ summary: ':workspace 내부에 채널을 생성함' })
  @Post()
  createChannels(@Body() body, @Param() param) {
    console.log(param.url);
    console.log(body.name);
  }
  //----------------------------
  @ApiOperation({ summary: ':workspace 내부의 :name 정보를 가져옴' })
  @Get(':name')
  getSpecificChannel(@Param() param) {
    console.log(param.url, param.name);
  }
  //----------------------------
  @ApiOperation({ summary: ':workspace 내부의 :name의 채팅을 가져옴' })
  @Get(':name/chats')
  getChats(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.url, param.name);
  }
  //----------------------------
  @ApiOperation({
    summary: ':workspace 내부의 :name의 안 읽은 채팅 유무를 가져옴',
  })
  @Get(':name/unreads')
  getUnread(@Query() query, @Param() param) {
    console.log(query.after);
    console.log(param.url, param.name);
  }
  //----------------------------
  @ApiOperation({ summary: ':workspace 내부의 :name의 채팅을 저장' })
  @Post(':name/chats')
  postChat(@Body() body, @Param() param) {
    console.log(param.url, param.name);
    console.log(body.content);
  }
  //----------------------------
  @ApiOperation({ summary: ':workspace 내부의 :name의 이미지를 저장' })
  @Post(':name/images')
  postImage(@Body() body, @Param() param) {
    console.log(param.url, param.name);
    console.log(body.content);
  }
  //----------------------------
  @ApiOperation({ summary: ':workspace 내부의 :name 멤버 목록을 가져옴' })
  @Get(':name/members')
  getAllMembers(@Param() param) {
    console.log(param.url, param.name);
  }
  //----------------------------
  @ApiOperation({ summary: ':workspace 내부의 :name로 멤버 초대' })
  @Post(':name/members')
  inviteMembers(@Body() body, @Param() param) {
    console.log(param.url, param.name);
    console.log(body.email);
  }
}
