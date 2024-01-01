import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/Workspacemembers';
import { ChannelMembers } from 'src/entities/Channelmembers';
import { Workspaces } from 'src/entities/Workspaces';
import { LastChannelRead } from 'src/entities/LastChannelRead';
import { LastDmRead } from 'src/entities/LastDmRead';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      WorkspaceMembers,
      ChannelMembers,
      Workspaces,
      LastChannelRead,
      LastDmRead,
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
