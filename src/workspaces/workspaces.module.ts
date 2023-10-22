import { Module } from '@nestjs/common';
import { CoService } from './co/co.service';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';

@Module({
  providers: [CoService, WorkspacesService],
  controllers: [WorkspacesController]
})
export class WorkspacesModule {}
