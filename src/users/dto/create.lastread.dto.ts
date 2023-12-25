import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateChannelLastReadDto {
  @IsInt()
  @IsNotEmpty()
  workspaceId: number;

  @IsInt()
  @IsNotEmpty()
  channelId: number;

  @IsInt()
  @IsNotEmpty()
  time: number;
}

export class RoadChannelLastReadDto {
  @IsInt()
  @IsNotEmpty()
  workspaceId: number;

  @IsInt()
  @IsNotEmpty()
  channelId: number;
}

export class CreateDmLastReadDto {
  @IsInt()
  @IsNotEmpty()
  workspaceId: number;

  @IsInt()
  @IsNotEmpty()
  otherId: number;

  @IsInt()
  @IsNotEmpty()
  time: number;
}

export class RoadDmLastReadDto {
  @IsInt()
  @IsNotEmpty()
  workspaceId: number;

  @IsInt()
  @IsNotEmpty()
  otherId: number;
}
