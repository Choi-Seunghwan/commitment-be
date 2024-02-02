import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { CommitmentActivityInfo, CommitmentInfo } from './commitment.type';
import { Commitment } from './commitment.entity';
import { UserInfo } from 'src/user/user.type';
import { calcCommitmentProcessDays } from './commitment.utils';

export const commitmentInfoMapper = (commitment: Commitment, userInfo: UserInfo): CommitmentInfo => {
  const commitmentInfo: CommitmentInfo = {
    commitmentId: commitment.id,
    title: commitment.title,
    description: commitment.description,
    createDate: commitment.createDate,
    renewalPeriodDays: commitment.renewalPeriodDays,
    creator: userInfo,
  };

  return commitmentInfo;
};

export const commitmentActivityInfoMapper = (commitmentActivity: CommitmentActivity): CommitmentActivityInfo => {
  const commitmentActivityInfo: CommitmentActivityInfo = {
    commitmentActivityId: commitmentActivity.id,
    renewalDate: commitmentActivity.renewalDate,
    expirationDate: commitmentActivity.expirationDate,
    completeDate: commitmentActivity.completeDate || null,
    processDays: calcCommitmentProcessDays(commitmentActivity.createDate),
    status: commitmentActivity.status,
  };

  return commitmentActivityInfo;
};
