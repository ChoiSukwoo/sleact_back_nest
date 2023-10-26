import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'; // Swagger의 ApiOperation 추가
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { WorkspacesService } from './workspaces.service';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import {
  CreateWorkspaceDto,
  CreateWorkspaceMemberDto,
} from './dto/create.workspace.dto';

@ApiTags('Workspaces')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspaceService: WorkspacesService) {}

  @ApiOperation({
    summary: '내 워크스페이스 목록을 가져옴',
  })
  @Get()
  getUsers(@User() user: Users) {
    return this.workspaceService.findMyWorkspaces(user.id);
  }
  //----------------------------
  @ApiOperation({
    summary: '워크스페이스를 생성함',
  })
  @Post()
  createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    console.log(body.name, body.url);
    return this.workspaceService.createWorkspace(body.name, body.url, user.id);
  }
  //----------------------------
  @ApiOperation({
    summary: ':workspace 내부의 멤버 목록을 가져옴',
  })
  @Get(':url/members')
  getAllMembersFromWorkspace(@Param() param) {
    return this.workspaceService.getWorkspaceMembers(param.url);
  }
  //----------------------------
  @ApiOperation({
    summary: ':workspace로 멤버 초대',
  })
  @Post(':url/members')
  inviteMembersToWorkspace(
    @Param() param,
    @Body() body: CreateWorkspaceMemberDto,
  ) {
    return this.workspaceService.createWorkspaceMembers(param.url, body.email);
  }
  //----------------------------
  @ApiOperation({
    summary: ':workspace에서 :id 멤버 제거(또는 탈퇴)',
  })
  @Post(':url/members/:id')
  kickMemberFromWorkspace(@Param() param) {
    return this.workspaceService.kickMemberFromWorkspace(param.url, param.id);
  }
  //----------------------------
  @ApiOperation({
    summary: ':workspace의 멤버인 특정 :id 사용자 정보를 가져옴',
  })
  @Get(':url/members/:id')
  getMemberInfoInWorkspace(@Param() param) {
    return this.workspaceService.getWorkspaceMember(param.url, param.id);
  }
}
