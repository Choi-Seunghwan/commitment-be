import { UserInfo } from 'src/user/user';

export type CommitmentActivityStatus = 'PROCESS' | 'COMPLETE';

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
}
