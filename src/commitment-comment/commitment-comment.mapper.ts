import { CommitmentComment } from './commitment-comment.entity';
import { CommitmentCommentInfo } from './commitment-comment.type';
import { UserInfo } from 'src/user/user';

export const commitmentCommentMapper = (comment: CommitmentComment, userInfo: UserInfo): CommitmentCommentInfo => {
  const commitmentComment: CommitmentCommentInfo = {
    id: comment.id,
    content: comment.content,
    user: userInfo,
    createDate: comment.createDate,
  };
  return commitmentComment;
};
