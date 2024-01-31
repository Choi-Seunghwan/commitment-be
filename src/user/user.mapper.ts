import { UserInfo, UserMyInfo } from './user.type';
import { User } from './user.entity';

export const userInfoMapper = (user: User): UserInfo => {
  return {
    id: user?.id,
    nickname: user?.nickname,
    createdDate: user?.createDate,
  };
};

export const userMyInfoMapper = (user: User): UserMyInfo => {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    isGuest: user.isGuest,
    createDate: user.createDate,
  };
};
