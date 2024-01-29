import { IsString, IsUUID } from 'class-validator';

export class CommitmentCommentDto {
  @IsString()
  content: string;
}

export class UpdateCommitmentCommentParam {
  @IsUUID()
  commitmentId: string;

  @IsUUID()
  commentId: string;
}
