import { UserInfo } from 'src/user/user';
import { COMMITMENT_STATUS, COMMITMENT_TYPE } from './commitment.constant';

export enum CommitmentActivityStatus {
  [COMMITMENT_STATUS.PROGRESS] = COMMITMENT_STATUS.PROGRESS,
  [COMMITMENT_STATUS.COMPLETE] = COMMITMENT_STATUS.COMPLETE,
}
export enum CommitmentType {
  [COMMITMENT_TYPE.PERSONAL] = COMMITMENT_TYPE.PERSONAL,
  [COMMITMENT_TYPE.PUBLIC] = COMMITMENT_TYPE.PUBLIC,
}

export interface CommitmentInfo {
  commitmentId: string;
  title: string;
  description?: string;
  createDate: Date;
  renewalPeriodDays: number;
  activity?: CommitmentActivityInfo;
  creator?: UserInfo;
}

export interface CommitmentActivityInfo {
  commitmentActivityId: string;
  isActive: boolean;
  renewalDate: Date;
  expirationDate: Date;
  completeDate?: Date;
  processDays: number;
  status: CommitmentActivityStatus;
}
