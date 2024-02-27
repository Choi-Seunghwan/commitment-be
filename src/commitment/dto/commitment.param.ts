import { IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/utils/pagination.dto';

export class CommitmentParam extends PaginationQueryDto {
  @IsString()
  type: string;
}

export class CommitmentIdParam {
  @IsUUID()
  commitmentId: string;
}
