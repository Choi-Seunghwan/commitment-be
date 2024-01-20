import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUniqueNickname(): Promise<string> {
    let nickname;
    let userExists = false;

    do {
      nickname = `guest_${uuidv4().split('-')[0]}`;
      const user = await this.userRepo.findOne({ where: { nickname } });
      userExists = !!user;
    } while (userExists);

    return nickname;
  }

  async createGuestUser(): Promise<User> {
    const nickname = await this.createUniqueNickname();
    const guestUser: User = this.userRepo.create({ nickname, isGuest: true });
    const savedGuestUser = await this.userRepo.save(guestUser);
    return savedGuestUser;
  }
}
