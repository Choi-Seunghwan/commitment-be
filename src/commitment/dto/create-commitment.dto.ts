import { IsEnum, IsString } from 'class-validator';
import { CommitmentType } from '../commitment';

export class CreateCommitmentDto {
  @IsString()
  title: string;

  @IsEnum(CommitmentType)
  type: string;
}
