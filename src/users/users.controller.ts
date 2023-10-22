import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; // Swagger의 ApiOperation 추가
import { UsersService } from './users.service';
import { JoinRequestDto } from './dto/join.request.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
    return user;
  }
  //----------------------------
  @ApiOperation({
    summary: '새로운 사용자를 등록함',
  })
  @Post()
  postUsers(@Body() data: JoinRequestDto) {
    this.usersService.postUsers(data.email, data.nickname, data.password);
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
