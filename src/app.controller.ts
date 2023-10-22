import { Controller, Get, Inject } from '@nestjs/common';
import { IAppService } from './app.service';

@Controller()
export class AppController {
  constructor(@Inject('AppService') private readonly appService: IAppService) {}

  @Get()
  getHello(): string {
    return this.appService.getSecret();
  }
}
