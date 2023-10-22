import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger'; // Swagger의 ApiOperation 추가

@ApiTags('Workspaces')
@Controller('api/workspaces')
export class WorkspacesController {
  @ApiOperation({
    summary: '내 워크스페이스 목록을 가져옴',
  })
  @Get()
  getWorkspace() {}
  //----------------------------
  @ApiOperation({
    summary: '워크스페이스를 생성함',
  })
  @Post()
  createWorkspace(@Body() body) {
    console.log(body.workspace, body.url);
  }
  //----------------------------
  @ApiOperation({
    summary: ':workspace 내부의 멤버 목록을 가져옴',
  })
  @Get(':url/members')
  getAllMembersFromWorkspace(@Param() param) {
    console.log(param.url);
  }
  //----------------------------
  @ApiOperation({
    summary: ':workspace로 멤버 초대',
  })
  @Post(':url/members')
  inviteMembersToWorkspace(@Body() body, @Param() param): void {
    console.log(param.url);
    console.log(body.email);
  }
  //----------------------------
  @ApiOperation({
    summary: ':workspace에서 :id 멤버 제거(또는 탈퇴)',
  })
  @Delete(':url/members/:id')
  kickMemberFromWorkspace(@Param() param) {
    console.log(param.url, param.id);
  }
  //----------------------------
  @ApiOperation({
    summary: ':workspace의 멤버인 특정 :id 사용자 정보를 가져옴',
  })
  @Get(':url/members/:id')
  getMemberInfoInWorkspace(@Param() param) {
    console.log(param.url, param.id);
  }
}
