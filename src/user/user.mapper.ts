import { UserInfo } from './user';
import { User } from './user.entity';

export const userInfoMapper = (user: User): UserInfo => {
  return {
    id: user?.id,
    email: user?.email || null,
    nickname: user?.nickname,
    createdDate: user?.createDate,
  };
};
