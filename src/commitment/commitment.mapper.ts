import { CommitmentActivity } from 'src/commitment-activity/commitment-activity.entity';
import { calcCommitmentDays } from './commitment.utils';
import { UserCommitmentInfo } from './commitment';
import { COMMITMENT_STATUS } from './commitment.constant';

export const userCommitmentInfoMapper = (commitmentActivity: CommitmentActivity): UserCommitmentInfo => {
  const days = calcCommitmentDays(commitmentActivity.createDate);
  const commitment = commitmentActivity?.commitment;
  const status = commitmentActivity?.completeDate ? COMMITMENT_STATUS.COMPLETE : COMMITMENT_STATUS.PROGRESS;

  const userCommitmentInfo: UserCommitmentInfo = {
    id: commitment?.id,
    title: commitment?.title,
    createDate: commitment?.createDate,
    days,
    status,
  };

  return userCommitmentInfo;
};
