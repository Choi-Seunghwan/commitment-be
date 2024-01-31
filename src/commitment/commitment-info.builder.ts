import { UserInfo } from 'src/user/user.type';
import { CommitmentActivityInfo, CommitmentInfo } from './commitment.type';
import { userInfoMapper } from 'src/user/user.mapper';
import { User } from 'src/user/user.entity';
import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { commitmentActivityInfoMapper, commitmentInfoMapper } from './commitment.mapper';
import { Commitment } from './commitment.entity';

export class CommitmentInfoBuilder {
  private commitmentInfo: CommitmentInfo;
  private userInfo: UserInfo;
  private commitmentActivityInfo: CommitmentActivityInfo;

  setUserData(user: User): CommitmentInfoBuilder {
    this.userInfo = userInfoMapper(user);
    return this;
  }

  setCommitmentActivityData(commitmentActivity: CommitmentActivity): CommitmentInfoBuilder {
    this.commitmentActivityInfo = commitmentActivityInfoMapper(commitmentActivity);
    return this;
  }

  setCommitmentData(commitment: Commitment): CommitmentInfoBuilder {
    this.commitmentInfo = commitmentInfoMapper(commitment, this.userInfo);
    return this;
  }

  build(): CommitmentInfo {
    if (this.commitmentActivityInfo) this.commitmentInfo.activity = this.commitmentActivityInfo;
    return this.commitmentInfo;
  }
}

// 사용 예시
// const commitmentInfo = new CommitmentInfoBuilder().setUserData(user).setCommitmentData(commitment).build();
