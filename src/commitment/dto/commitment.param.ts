import { IsString } from 'class-validator';

export class CommitmentParam {
  @IsString()
  commitmentId: string;
}
