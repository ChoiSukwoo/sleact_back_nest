import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
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
  @ApiOperation({
    summary: '사용자 로그아웃',
  })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
