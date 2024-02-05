import { CommitmentComment } from './commitment-comment.entity';
import { CommitmentCommentInfo } from './comment.type';

export const commitmentCommentMapper = (commitmentComment: CommitmentComment): CommitmentCommentInfo => {
  return {
    commentId: commitmentComment.id,
    content: commitmentComment.content,
    createDate: commitmentComment.createDate,
  };
};
