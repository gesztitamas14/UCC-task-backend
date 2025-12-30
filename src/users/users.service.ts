import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async setPasswordResetToken(userId: number, token: string, expires: Date) {
    await this.usersRepository.update(userId, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
  }
}
