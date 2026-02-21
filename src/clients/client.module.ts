import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getSecretValue } from 'src/config/configuration.config';
import { AuthClient } from './auth-client';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: getSecretValue(configService).timeout,
        maxRedirects: getSecretValue(configService).max_redirects,
      }),
    }),
  ],
  providers: [AuthClient],
  exports: [AuthClient],
})
export class ClientModule {}
