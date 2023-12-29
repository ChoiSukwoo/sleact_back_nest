import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import multer from 'multer';
import path from 'path';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { DmsService } from './dms.service';

@ApiTags('DM')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces/:url/dms')
export class DmsController {
  constructor(private dmsService: DmsService) {}

  @ApiOperation({
    summary: '워크스페이스 내 특정 Id와 나눈 DM 채팅 모두 가져오기',
  })
  @Get('/:id/chats')
  async getWorkspaceDMChats(
    @Param() param,
    @Query() query,
    @User() user: Users,
  ) {
    return this.dmsService.getWorkspaceDMChats(
      param.url,
      +param.id,
      +user.id,
      +query.perpage,
      +query.page,
    );
  }

  @ApiOperation({ summary: '워크스페이스 특정 ID에세 DM 채팅 생성하기' })
  @Post('/:id/chats')
  async createWorkspaceDMChats(
    @Param() param,
    @Body('content') content,
    @User() user: Users,
  ) {
    return this.dmsService.createWorkspaceDMChats(
      param.url,
      content,
      +param.id,
      user.id,
    );
  }

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
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: Users,
  ) {
    return this.dmsService.createWorkspaceDMImages(
      param.url,
      files,
      +param.id,
      user.id,
    );
  }

  @ApiOperation({ summary: '안 읽은 개수 가져오기' })
  @Get('/:id/unreads')
  async getUnreads(
    @Param() param,
    @Query('after', ParseIntPipe) after: number,
    @User() user: Users,
  ) {
    return this.dmsService.getDMUnreadsCount(
      param.url,
      +param.id,
      user.id,
      after,
    );
  }

  @Post('/:id/test')
  async testSocket(@Param() param) {
    return this.dmsService.testSocket(param.url, +param.id);
  }
}
