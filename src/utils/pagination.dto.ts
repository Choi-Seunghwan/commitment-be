import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsPositive()
  page: number;

  @Min(1)
  limit: number;
}
