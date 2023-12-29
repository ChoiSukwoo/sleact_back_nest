import { Module } from '@nestjs/common';
import { DmsService } from './dms.service';
import { DmsController } from './dms.controller';
import { EventsGateway } from 'src/events/events.gateway';
import { EventsModule } from 'src/events/events.module';
import { Workspaces } from 'src/entities/Workspaces';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dms } from 'src/entities/Dms';
import { Users } from 'src/entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Dms, Users, Workspaces]), EventsModule],
  providers: [EventsGateway, DmsService],
  controllers: [DmsController],
})
export class DmsModule {}
