import { UserInfo } from 'src/user/user.type';

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
  renewalDate: Date;
  expirationDate: Date;
  completeDate?: Date;
  processDays: number;
  status: string;
}

export enum CommitmentRenewalPeriodDays {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
}
