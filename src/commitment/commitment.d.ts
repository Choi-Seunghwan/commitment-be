import { UserInfo } from 'src/user/user';

export type UserCommitmentStatus = 'PROCESS' | 'COMPLETE';

export interface UserCommitmentInfo {
  id: string;
  title: string;
  createDate: Date;
  days: number;
  endDate?: Date;
  status: CommitmentStatus;
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
}
