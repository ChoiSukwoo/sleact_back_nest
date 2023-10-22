import { Injectable } from '@nestjs/common';

export interface IAppService {
  getSecret(): string;
}

@Injectable()
export class AppService implements IAppService {
  getSecret(): string {
    return '실제 배포 환경';
  }
}

@Injectable()
export class Test_AppService implements IAppService {
  getSecret(): string {
    return '개발 테스트 환경';
  }
}
