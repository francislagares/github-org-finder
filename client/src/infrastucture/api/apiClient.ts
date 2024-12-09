import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { DEFAULT_API_BASE_URL } from '@/infrastucture/constants';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  },
);

class ApiService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public getAll = async <R = T>(config?: AxiosRequestConfig): Promise<R> => {
    return axiosInstance.get<R>(this.endpoint, config).then(res => res.data);
  };

  public post = async <R = T>(
    data: T,
    config?: AxiosRequestConfig,
  ): Promise<R> => {
    return axiosInstance
      .post<R>(this.endpoint, data, config)
      .then(res => res.data);
  };

  public delete = async (
    id: string,
    config?: AxiosRequestConfig,
  ): Promise<void> => {
    await axiosInstance.delete(`${this.endpoint}/${id}`, config);
  };
}

export default ApiService;
