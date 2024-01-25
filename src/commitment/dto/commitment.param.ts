import { IsUUID } from 'class-validator';

export class CommitmentParam {
  @IsUUID()
  commitmentId: string;
}
