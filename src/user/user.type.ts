export interface UserInfo {
  id: string;
  nickname: string;
  createdDate?: Date;
}

export interface UserMyInfo {
  id: string;
  email: string;
  nickname: string;
  isGuest: boolean;
  createDate: Date;
}
