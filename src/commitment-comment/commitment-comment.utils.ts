import { COMMENT_MAX_LENGTH } from './commitment-comment.constant';

export const validateCommentContent = (content: string): boolean => {
  if (content.length > COMMENT_MAX_LENGTH) return false;
  else return true;
};
