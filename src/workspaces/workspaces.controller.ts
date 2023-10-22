import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('api/workspaces')
export class WorkspacesController {
  //내 워크스페이스 목록을 가져옴
  @Get()
  getWorkspace() {}

  //워크스페이스를 생성함
  @Post()
  createWorkspace(@Body() body) {
    console.log(body.workspace, body.url);
  }

  //:workspace 내부의 멤버 목록을 가져옴
  @Get(':url/members')
  getAllMembersFromWorkspace(@Param() param) {
    console.log(param.url);
  }

  //:workspace로 멤버 초대
  @Post(':url/members')
  inviteMembersToWorkspace(@Body() body, @Param() param): void {
    console.log(param.url);
    console.log(body.email);
  }

  //:workspace에서 :id 멤버 제거(또는 탈퇴)
  @Delete(':url/members/:id')
  kickMemberFromWorkspace(@Param() param) {
    console.log(param.url, param.id);
  }

  //:workspace의 멤버인 특정 :id 사용자 정보를 가져옴
  @Get(':url/members/:id')
  getMemberInfoInWorkspace(@Param() param) {
    console.log(param.url, param.id);
  }
}
