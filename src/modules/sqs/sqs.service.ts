import { Injectable, Logger } from '@nestjs/common';
import { BoardingHouseRoomRepository } from 'src/repositories/boarding-house-room.repository';
import { AwsUtil } from 'src/utils/aws.utils';
import { TransactionUtl } from 'src/utils/transaction.util';
import { QueryRunner } from 'typeorm';

@Injectable()
export class SqsService {
  private logger: Logger = new Logger(SqsService.name);

  constructor(
    private readonly repository: BoardingHouseRoomRepository,
    private readonly awsUtil: AwsUtil,
    private readonly transactionUtil: TransactionUtl,
  ) {}

  public onModuleInit() {
    this.logger.log('Startuing SQS Pooling...');
    this.startPooling().catch((err: any) => {
      this.logger.error('Failed to start SQS Pooling', err);
    });
  }

  public async startPooling() {
    while (true) {
      try {
        const response = await this.awsUtil.recieveMessageFromSQS({
          maxNumberOfMessage: 5,
          waitTimeSeconds: 20,
        });

        if (!response.Messages?.length) continue;

        for (const message of response.Messages) {
          await this.handleMessage(message);
        }
      } catch (error) {
        this.logger.error('Error polling SQS Message', error);
        await this.sleep(3000);
      }
    }
  }

  private async handleMessage(message: any) {
    try {
      const payload = JSON.parse(message.Body);
      this.logger.log(`Received ${JSON.stringify(payload)}`);
      await this.process(payload);
      await this.awsUtil.deleteMEssageFromSQS(payload);
    } catch (error) {
      this.logger.error('Error processing SQS Message', error);
    }
  }

  public async process(payload: any) {
    try {
      const data = payload.data;
      await this.transactionUtil.executeTransaction(
        async (queryRunner: QueryRunner) => {
          await this.repository.updateWithTransaction(
            data.room_id,
            {
              status: data.status,
            },
            queryRunner,
          );
        },
      );
    } catch (error) {
      this.logger.error('Error processing SQS Message', error);
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
