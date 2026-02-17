import { Module } from '@nestjs/common';
import { AwsUtil } from './aws.utils';
import { CustomUtil } from './custom.util';
import { PaginationUtil } from './pagination.util';
import { TransactionUtl } from './transaction.util';

@Module({
  providers: [AwsUtil, CustomUtil, PaginationUtil, TransactionUtl],
  exports: [AwsUtil, CustomUtil, PaginationUtil, TransactionUtl],
})
export class UtilModule {}
