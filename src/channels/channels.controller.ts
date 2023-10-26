import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { ChannelsService } from './channels.service';
import {
  CreateChannelDto,
  CreateChatDto,
  InviteChannelDto,
} from './dto/create.channel.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import fs from 'fs';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('Channel')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private channelService: ChannelsService) {}

  @ApiOperation({
    summary: ':url 내부의 내가 속해있는 채널 리스트를 가져옴',
  })
  @Get()
  getAllChannels(@User() user: Users, @Param() param) {
    return this.channelService.getWorkspaceChannels(param.url, user.id);
  }
  //----------------------------
  @ApiOperation({ summary: ':url 내부에 채널을 생성함' })
  @Post()
  createChannels(
    @User() user: Users,
    @Body() body: CreateChannelDto,
    @Param() param,
  ) {
    return this.channelService.createWorkspaceChannels(
      param.url,
      body.name,
      user.id,
    );
  }
  //----------------------------
  @ApiOperation({ summary: ':url 내부의 :name 정보를 가져옴' })
  @Get(':name')
  getSpecificChannel(@Param() param) {
    return this.channelService.getWorkspaceChannel(param.url, param.name);
  }
  //----------------------------
  @ApiOperation({ summary: ':url 내부의 :name의 채팅을 가져옴' })
  @Get(':name/chats')
  getChats(@Query() query, @Param() param) {
    return this.channelService.getWorkspaceChannelChats(
      param.url,
      param.name,
      +query.perPage,
      +query.page,
    );
  }
  //----------------------------
  @ApiOperation({
    summary: ':url 내부의 :name의 안 읽은 채팅 유무를 가져옴',
  })
  @Get(':name/unreads')
  getUnread(@Query() query, @Param() param) {
    return this.channelService.getChannelUnreadsCount(
      param.url,
      param.name,
      query.after,
    );
  }
  //----------------------------
  @ApiOperation({ summary: ':url 내부의 :name의 채팅을 저장' })
  @Post(':name/chats')
  postChat(@User() user: Users, @Body() body: CreateChatDto, @Param() param) {
    console.log(param.url, param.name);
    console.log(body.content);
    return this.channelService.createWorkspaceChannelChats(
      param.url,
      param.name,
      body.content,
      user.id,
    );
  }
  //----------------------------
  @ApiOperation({ summary: ':url 내부의 :name의 이미지를 저장' })
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @Post(':name/images')
  postImage(
    @User() user: Users,
    @UploadedFile() files: Express.Multer.File[],
    @Param() param,
  ) {
    return this.channelService.createWorkspaceChannelImages(
      param.url,
      param.name,
      files,
      user.id,
    );
  }

  //------------- getAllMembers(채널 멤버 목록 획득) ----------------------------
  @ApiOperation({ summary: ':url 내부의 :name 멤버 목록을 가져옴' })
  @Get(':name/members')
  getAllMembers(@Param() param) {
    return this.channelService.getWorkspaceChannelMembers(
      param.url,
      param.name,
    );
  }
  //------------- inviteMembers(멤버 초대) ----------------------------
  @ApiOperation({ summary: ':url 내부의 :name로 멤버 초대' })
  @Post(':name/members')
  inviteMembers(@Body() body: InviteChannelDto, @Param() param) {
    return this.channelService.createWorkspaceChannelMembers(
      param.url,
      param.name,
      body.email,
    );
  }
}
