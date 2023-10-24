import {
  BadRequestException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  getUser() {}

  async join(email: string, nickname: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    // 동일 이메일의 유저가 존재하는지 확인
    if (user) {
      throw new UnauthorizedException(
        '이미 존재하는 이메일 또는 닉네임입니다.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
