import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Min(1)
  limit?: number;
}
