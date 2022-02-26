import axios, {AxiosInstance, AxiosRequestConfig, Method} from 'axios';
import authStore from '../store/auth';
import {HttpError} from './error';

export abstract class HttpClient {
  #instance: AxiosInstance;
  #config: AxiosRequestConfig;
  constructor(config: AxiosRequestConfig) {
    this.#config = config;
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

    if (authStore.token) {
      config.headers = {
        ...config.headers,
        ['Authorization']: `bearer ${authStore.token}`,
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
}
