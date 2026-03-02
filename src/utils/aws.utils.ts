/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { IAWSConfig } from '../interfaces/aws.interface';
import { awsConstant } from '../constants/aws.constant';
import { DeleteMessageBatchCommand, DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

@Injectable()
export class AwsUtil {
  private readonly logger: Logger = new Logger(AwsUtil.name);
  private readonly s3Client: S3Client;
  private readonly ssmClient: SSMClient;
  private readonly sqsClient: SQSClient;

  constructor() {
    const params: any = {
      region: awsConstant.REGION_AWS,
      credentials: {
        accessKeyId: awsConstant.ACCESS_KEY_AWS,
        secretAccessKey: awsConstant.SECRET_ACCESS_KEY_AWS,
      },
    };

    this.s3Client = new S3Client(params);
    this.ssmClient = new SSMClient(params);
    this.sqsClient = new SQSClient(params);
  }

  private getUrlS3(key: string): string {
    return `https://s3.${awsConstant.REGION_AWS}.amazonaws.com/${awsConstant.BUCKET_NAME_AWS}/${encodeURIComponent(key)}`;
  }

  public async uploadFileToS3(params: {
    key: string;
    body: Buffer | Uint8Array | Blob | string;
    contentType: string;
  }): Promise<{ url: string }> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: awsConstant.BUCKET_NAME_AWS,
          Key: params.key,
          Body: params.body,
          ContentType: params.contentType,
        }),
      );

      return {
        url: this.getUrlS3(params.key),
      };
    } catch (error) {
      this.logger.error('Error upload file to S3', error);
      throw error;
    }
  }

  public async getParameterStoreValue(): Promise<IAWSConfig> {
    try {
      const parameterNames = awsConstant.PARAMETER_STORE_NAMES;
      const splitParameterNames = parameterNames
        ? parameterNames.split(',').map((name) => name.trim()).filter(Boolean)
        : [];
      let result: IAWSConfig = {} as IAWSConfig;
      for (const item of splitParameterNames) {
        const response: any = await this.ssmClient.send(
          new GetParameterCommand({
            Name: item,
            WithDecryption: true,
          }),
        );
        const dataName: IAWSConfig = JSON.parse(response.Parameter.Value);
        result = {
          ...result,
          ...dataName,
        };
      }
      return result;
    } catch (error) {
      this.logger.error('Error fetching parameter store values', error);
      throw error;
    }
  }

  public async recieveMessageFromSQS(params?: {
    maxNumberOfMessage?:number,
    waitTimeSeconds?: number,
  }) {
    try {
      return await this.sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: awsConstant.SQS_QUEUE_BOARDING_HOUSE_URL_AWS,
          MaxNumberOfMessages: params?.maxNumberOfMessage,
          WaitTimeSeconds: params?.waitTimeSeconds,
        })
      );
    } catch (error) {
      this.logger.error('Error fetching parameter store values', error);
      throw error;
    }
  }

  public async deleteMEssageFromSQS(receiptHandle: string) {
    try {
      return await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: awsConstant.SQS_QUEUE_BOARDING_HOUSE_URL_AWS,
          ReceiptHandle: receiptHandle,
        })
      );
    } catch (error) {
      this.logger.error('Error fetching parameter store values', error);
      throw error;
    }
  }
}
