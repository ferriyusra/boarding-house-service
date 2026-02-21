import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/interfaces/user.interface';
import { getSecretValue } from 'src/config/configuration.config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthClient {
  private logger: Logger = new Logger(AuthClient.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async getUserInfo(token: string, uuid: string): Promise<IUser> {
    try {
      const url = `${getSecretValue(this.configService).clientUrl?.auth_service}/api/v1/auth/${uuid}`;
      const response: AxiosResponse<any, any> = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      return response.data.data as IUser;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async getUserInfoWithoutToken(uuid: string): Promise<IUser> {
    try {
      const url = `${getSecretValue(this.configService).clientUrl?.auth_service}/api/v1/auth/without-token${uuid}`;
      const response: AxiosResponse<any, any> = await firstValueFrom(
        this.httpService.get(url),
      );

      return response.data.data as IUser;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
