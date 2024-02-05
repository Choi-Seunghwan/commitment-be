import { UserInfo } from 'src/user/user.type';

export interface CommitmentCommentInfo {
  commentId: string;
  content: string;
  createDate: Date;
  user?: UserInfo;
}
