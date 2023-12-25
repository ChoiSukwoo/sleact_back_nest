import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'; // Swagger의 ApiOperation 추가
import { UsersService } from './users.service';
import { JoinRequestDto } from './dto/join.request.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import {
  CreateChannelLastReadDto,
  CreateDmLastReadDto,
  RoadChannelLastReadDto,
  RoadDmLastReadDto,
} from './dto/create.lastread.dto';
import { Users } from 'src/entities/Users';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiCookieAuth('connect.sid')
  @ApiOperation({
    summary: '현재 로그인된 사용자 정보를 가져옴',
  })
  @ApiResponse({
    type: UserDto,
    status: 200,
    description: '성공',
  })
  @Get()
  getUsers(@User() user) {
    return user || false;
  }
  //----------------------------
  @ApiOperation({
    summary: '새로운 사용자를 등록함',
  })
  @UseGuards(NotLoggedInGuard)
  @Post()
  async join(@Body() data: JoinRequestDto) {
    await this.usersService.join(data.email, data.nickname, data.password);
  }
  //----------------------------
  @ApiOperation({
    summary: '사용자 로그인',
  })
  @ApiResponse({
    type: UserDto,
    status: 200,
    description: '성공',
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  logIn(@User() user) {
    return user;
  }
  //----------------------------
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(LoggedInGuard)
  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }

  @Post('/channel/lastread')
  async setChannelLastReadTime(
    @User() user: Users,
    @Body() body: CreateChannelLastReadDto,
  ) {
    console.log('user : ', user);
    console.log('body : ', body);

    return await this.usersService.setChannelLastRead(
      user.id,
      body.workspaceId,
      body.channelId,
      new Date(body.time),
    );
  }

  @Get('/channel/lastread')
  async getChannelReadLastTime(
    @User() user: Users,
    @Body() body: RoadChannelLastReadDto,
  ) {
    return await this.usersService.getChannelLastRead(
      user.id,
      body.workspaceId,
      body.channelId,
    );
  }

  @Post('/dm/lastread')
  async setDmLastReadTime(
    @User() user: Users,
    @Body() body: CreateDmLastReadDto,
  ) {
    console.log('user : ', user);
    console.log('body : ', body);

    return await this.usersService.setDmLastRead(
      user.id,
      body.workspaceId,
      body.otherId,
      new Date(body.time),
    );
  }

  @Get('/dm/lastread')
  async getDmLastReadTime(
    @User() user: Users,
    @Body() body: RoadDmLastReadDto,
  ) {
    return await this.usersService.getDmLastRead(
      user.id,
      body.workspaceId,
      body.otherId,
    );
  }
}
