import { IsEnum, IsString } from 'class-validator';
import { CommitmentType } from '../commitment.type';

export class CreateCommitmentDto {
  @IsString()
  title: string;

  @IsEnum(CommitmentType)
  type: string;
}
