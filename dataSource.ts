import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { ChannelChats } from './src/entities/Channelchats';
import { ChannelMembers } from './src/entities/Channelmembers';
import { Channels } from './src/entities/Channels';
import { Dms } from './src/entities/Dms';
import { Mentions } from './src/entities/Mentions';
import { Users } from './src/entities/Users';
import { WorkspaceMembers } from './src/entities/Workspacemembers';
import { Workspaces } from './src/entities/Workspaces';

dotenv.config();

const dataSource = new DataSource({
  port: 3306,
  type: 'mariadb',
  host: 'sukwoo.kr',
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    Dms,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default dataSource;
