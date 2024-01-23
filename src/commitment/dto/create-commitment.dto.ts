import { IsString } from 'class-validator';

export class CreateCommitmentDto {
  @IsString()
  title: string;
}
