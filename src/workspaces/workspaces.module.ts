import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { ChannelMembers } from 'src/entities/Channelmembers';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/Workspacemembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Channels } from 'src/entities/Channels';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workspaces,
      WorkspaceMembers,
      Channels,
      ChannelMembers,
      Users,
    ]),
  ],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}
