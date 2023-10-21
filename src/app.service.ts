import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(readonly configService: ConfigService) {}

  getSecret(): string {
    return this.configService.get('SECRET');
  }
}
