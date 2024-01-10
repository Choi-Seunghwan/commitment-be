import { IsString } from 'class-validator';

export class CreateCommitmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  userId: string;
}
