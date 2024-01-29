import { UserInfo } from 'src/user/user';

export interface CommitmentCommentInfo {
  id: string;
  user: UserInfo;
  content: string;
  createDate: Date;
}
