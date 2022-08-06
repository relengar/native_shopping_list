import axios, {AxiosInstance, AxiosRequestConfig, Method} from 'axios';
import {HttpError} from './error';
import {API_URL} from '@env';

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
};

let TOKEN: string | null = null;

export abstract class HttpClient {
  #instance: AxiosInstance;
  #config: AxiosRequestConfig;
  constructor(configOverride?: AxiosRequestConfig) {
    this.#config = {
      baseURL: API_URL,
      ...configOverride,
    };
    this.#instance = axios.create(this.#config);
  }

  protected async request<R, T = any>(
    url: `/${string}`,
    method: Method = 'GET',
    data?: T,
    configOverrides?: AxiosRequestConfig,
  ): Promise<R> {
    const config: AxiosRequestConfig = {
      ...this.#config,
      method,
      url,
      data,
      ...configOverrides,
    };

    if (TOKEN) {
      config.headers = {
        ...config.headers,
        ['Authorization']: `bearer ${TOKEN}`,
      };
    }

    try {
      const response = await this.#instance.request<R>(config);
      return response.data;
    } catch (error) {
      const httpError = this.createError(error);
      throw httpError;
    }
  }

  private createError(error: any): HttpError {
    const message = error.response?.data?.message ?? error?.toJSON().message;
    return new HttpError(message, error.status);
  }

  public set token(token: string | null) {
    TOKEN = token;
  }
}
