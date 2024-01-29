import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { CommitmentActivityInfo, CommitmentInfo } from './commitment.type';
import { Commitment } from './commitment.entity';
import { UserInfo } from 'src/user/user';
import { calcCommitmentProcessDays } from './commitment.utils';
import { COMMITMENT_STATUS } from './commitment.constant';

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
  const status = commitmentActivity.isActive ? COMMITMENT_STATUS.PROGRESS : COMMITMENT_STATUS.COMPLETE;

  const commitmentActivityInfo: CommitmentActivityInfo = {
    commitmentActivityId: commitmentActivity.id,
    isActive: commitmentActivity.isActive,
    renewalDate: commitmentActivity.renewalDate,
    expirationDate: commitmentActivity.expirationDate,
    completeDate: commitmentActivity.completeDate || null,
    processDays: calcCommitmentProcessDays(commitmentActivity.createDate),
    status,
  };

  return commitmentActivityInfo;
};
