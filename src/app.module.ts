import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, Test_AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channelchats } from './entities/Channelchats';
import { Channels } from './entities/Channels';
import { Users } from './entities/Users';
import { Channelmembers } from './entities/Channelmembers';
import { Dms } from './entities/Dms';
import { Mentions } from './entities/Mentions';
import { Workspacemembers } from './entities/Workspacemembers';
import { Workspaces } from './entities/Workspaces';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MorganModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    TypeOrmModule.forRoot({
      port: 3306,
      type: 'mariadb',
      host: 'sukwoo.kr',
      username: process.env.DB_USERNAME,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      entities: [
        Users,
        Channels,
        Channelchats,
        Channelmembers,
        Dms,
        Mentions,
        Workspacemembers,
        Workspaces,
      ],
      migrations: [__dirname + '/migrations/*.ts'],
      charset: 'utf8mb4_general_ci',
      synchronize: false,
      logging: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    {
      provide: 'AppService',
      useClass: process.env.NODE_ENV === 'prod' ? AppService : Test_AppService,
    },
  ],
})
export class AppModule {}
