export interface UserInfo {
  id: string;
  nickname: string;
  createDate?: Date;
}

export interface UserMyInfo {
  id: string;
  email: string;
  nickname: string;
  isGuest: boolean;
  createDate: Date;
}
