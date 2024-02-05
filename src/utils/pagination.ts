import { FindManyOptions, Repository } from 'typeorm';

export const paginate =
  <T>(repository: Repository<T>, page = 1, limit = 10, options: FindManyOptions<T> = {}) =>
  async (): Promise<{ data: T[]; count: number }> => {
    const [results, total] = await repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      ...options,
    });

    return {
      data: results,
      count: total,
    };
  };
