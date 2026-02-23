import { Injectable } from '@nestjs/common';
import { IPagination } from '../interfaces/database.interface';

@Injectable()
export class PaginationUtil {
  public generatePagination(params: IPagination): object {
    const totalPage = Math.ceil(params.count / params.pageSize);
    const nextPage = params.page < totalPage ? params.page + 1 : null;
    const previousPage = params.page > 1 ? params.page - 1 : null;

    return {
      rows: params.data,
      totalData: params.count,
      page: params.page,
      limit: params.pageSize,
      totalPage,
      nextPage,
      previousPage,
    };
  }
}
