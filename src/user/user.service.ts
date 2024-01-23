import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserInfo } from './user';

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

  createUserInfo(user: User): UserInfo {
    const { id, nickname, email } = user;
    const userInfo: UserInfo = { id, nickname, email };
    return userInfo;
  }

  async getUser(id: string): Promise<User> {
    const user: User = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('user not found');
    return user;
  }
}
