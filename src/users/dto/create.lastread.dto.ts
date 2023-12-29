import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateChannelLastReadDto {
  @IsInt()
  @IsNotEmpty()
  time: number;
}

export class CreateDmLastReadDto {
  @IsInt()
  @IsNotEmpty()
  time: number;
}
