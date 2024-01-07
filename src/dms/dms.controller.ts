import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { DmsService } from './dms.service';
import { CreateChatDto } from './dto/create.dms.dto';
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

@ApiTags('DM')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces/:url/dms')
export class DmsController {
  constructor(private dmsService: DmsService) {}

  //---------------------------- GetChats -----------------------
  @ApiOperation({
    summary: '워크스페이스 내 특정 Id와 나눈 DM 채팅 모두 가져오기',
  })
  @Get('/:id/chats')
  getWorkspaceDMChats(@Param() param, @Query() query, @User() user: Users) {
    return this.dmsService.getWorkspaceDMChats(
      param.url,
      +param.id,
      +user.id,
      +query.perpage,
      +query.page,
      +query.skip,
    );
  }

  //---------------------------- SaveChat -----------------------
  @ApiOperation({ summary: '워크스페이스 특정 ID에세 DM 채팅 생성하기' })
  @Post('/:id/chats')
  saveChat(@Param() param, @Body() body: CreateChatDto, @User() user: Users) {
    return this.dmsService.createWorkspaceDMChats(
      param.url,
      +param.id,
      body.content,
      user.id,
    );
  }

  //---------------------------- SaveChatImg -----------------------
  @ApiOperation({ summary: '워크스페이스 특정 DM 이미지 업로드하기' })
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
  @Post('/:id/images')
  async createWorkspaceDMImages(
    @Param() param,
    @User() user: Users,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.dmsService.createWorkspaceDMImages(
      param.url,
      +param.id,
      files,
      user.id,
    );
  }

  //---------------------------- GetUnread -----------------------
  @ApiOperation({ summary: '안 읽은 개수 가져오기' })
  @Get('/:id/unreads')
  async getUnreads(@Query() query, @Param() param, @User() user: Users) {
    return this.dmsService.getDMUnreadsCount(
      param.url,
      +param.id,
      user.id,
      query.after,
    );
  }
}
