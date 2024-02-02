import { IsEnum } from 'class-validator';
import { CommitmentActivityStatus, CommitmentType } from 'src/commitment/commitment.type';

export class UserCommitmentDto {
  @IsEnum(CommitmentType)
  type: CommitmentType.PERSONAL | CommitmentType.PUBLIC;

  @IsEnum(CommitmentActivityStatus)
  status: CommitmentActivityStatus.PROGRESS | CommitmentActivityStatus.COMPLETE;
}
