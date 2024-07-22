import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ApiService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public getAll = async (config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get<T>(this.endpoint, config).then(res => res.data);
  };

  public post = async (data: T, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance
      .post<T>(this.endpoint, data, config)
      .then(res => res.data);
  };

  public delete = async (
    id: string,
    config?: AxiosRequestConfig,
  ): Promise<void> => {
    return axiosInstance
      .delete(`${this.endpoint}/${id}`, config)
      .then(res => res.data);
  };
}

export default ApiService;
