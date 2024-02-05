import { IsEnum, IsString } from 'class-validator';
import { CommitmentRenewalPeriodDays, CommitmentType } from '../commitment.type';

export class CreateCommitmentDto {
  @IsString()
  title: string;

  @IsEnum(CommitmentType)
  type: string;

  @IsEnum(CommitmentRenewalPeriodDays)
  renewalPeriodDays: number;
}
