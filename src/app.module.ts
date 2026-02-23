import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilModule } from './utils/util.module';
import { ConfigModule } from './config/config.module';
import { RepositoryModule } from './repositories/repository.module';
import { ClientModule } from './clients/client.module';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';
import { getSecretValue } from './config/configuration.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CityModule } from './modules/city/city.module';
import { TypeModule } from './modules/type/type.module';

@Module({
  imports: [
    UtilModule,
    ConfigModule,
    RepositoryModule,
    ClientModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: getSecretValue(configService).rate_limit_time || 60,
          limit: getSecretValue(configService).rate_limit_max || 10,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: getSecretValue(configService).db_dialect as any,
        host: getSecretValue(configService).db_host,
        port: getSecretValue(configService).db_port,
        username: getSecretValue(configService).db_username,
        password: getSecretValue(configService).db_password,
        database: getSecretValue(configService).db_name,
        entities: [path.join(__dirname, `../../entities/*.entities{.ts,.js}`)],
        ssl: { rejectUnauthorized: false },
        synchronize: true,
        migrationsRun: true,
        connectTimeout: getSecretValue(configService).db_connection_timeout,
        acquireTimeout: getSecretValue(configService).db_acquire_timeout,
        poolSize: getSecretValue(configService).db_pool_size,
      }),
    }),
    CityModule,
    TypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
