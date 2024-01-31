import { UserInfo } from 'src/user/user.type';
import { COMMITMENT_STATUS, COMMITMENT_TYPE } from './commitment.constant';

export enum CommitmentActivityStatus {
  PROGRESS = 'PROGRESS',
  COMPLETE = 'COMPLETE',
}
export enum CommitmentType {
  PERSONAL = 'PERSONAL',
  PUBLIC = 'PUBLIC',
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
  status: string;
}
