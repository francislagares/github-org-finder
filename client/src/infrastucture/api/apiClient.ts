import { AxiosInstance, AxiosRequestConfig } from 'axios';

import { AXIOS_ERROR_MESSAGES } from '@/constants';
import { createAxiosInstance } from '@/infrastucture/api/config/axiosConfig';
import { ApiError } from '@/infrastucture/api/error/ApiError';

class ApiService<T> {
  private endpoint: string;
  private axiosInstance: AxiosInstance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.axiosInstance = createAxiosInstance();
  }

  private async handleRequest<R>(requestFn: () => Promise<R>): Promise<R> {
    try {
      return await requestFn();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, AXIOS_ERROR_MESSAGES.DEFAULT_ERROR, error);
    }
  }

  public async getAllRepos<R = T>(config?: AxiosRequestConfig): Promise<R> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get<R>(this.endpoint, config);
      return response.data;
    });
  }

  public async postRepo<R = T>(
    data: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.post<R>(
        this.endpoint,
        data,
        config,
      );
      return response.data;
    });
  }

  public async deleteRepo(config?: AxiosRequestConfig): Promise<void> {
    return this.handleRequest(async () => {
      await this.axiosInstance.delete(this.endpoint, config);
    });
  }
}

export default ApiService;
