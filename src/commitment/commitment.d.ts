export type UserCommitmentStatus = 'PROCESS' | 'COMPLETE';

export interface UserCommitmentInfo {
  id: string;
  title: string;
  createDate: Date;
  days: number;
  endDate?: Date;
  status: CommitmentStatus;
}
