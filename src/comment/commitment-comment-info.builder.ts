import { UserInfo } from 'src/user/user.type';
import { userInfoMapper } from 'src/user/user.mapper';
import { User } from 'src/user/user.entity';
import { CommitmentCommentInfo } from './comment.type';
import { CommitmentComment } from './commitment-comment.entity';
import { commitmentCommentMapper } from './comment.mapper';

export class CommitmentCommentInfoBuilder {
  private userInfo: UserInfo;
  private commitmentCommentInfo: CommitmentCommentInfo;

  setUserData(user: User): CommitmentCommentInfoBuilder {
    this.userInfo = userInfoMapper(user);
    return this;
  }

  setCommitmentCommentData(cc: CommitmentComment): CommitmentCommentInfoBuilder {
    this.commitmentCommentInfo = commitmentCommentMapper(cc);
    return this;
  }

  build(): CommitmentCommentInfo {
    if (this.userInfo) this.commitmentCommentInfo.user = this.userInfo;
    return this.commitmentCommentInfo;
  }
}
