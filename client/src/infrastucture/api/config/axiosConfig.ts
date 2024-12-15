import axios, { AxiosInstance } from 'axios';

import logger from '@/utils/logger';

import { API_BASE_URL, AXIOS_ERROR_MESSAGES } from '@/constants';
import { ApiError } from '@/infrastucture/api/error/ApiError';

const TIMEOUT = 30000; // 30 seconds
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL:
      API_BASE_URL.DEFAULT_API_BASE_URL || API_BASE_URL.CUSTOM_API_BASE_URL,
    timeout: TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    config => {
      // Add request logging
      logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    error => {
      logger.error('Request Error:', error);
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    response => {
      logger.info(`API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    async error => {
      const originalRequest = error.config;

      // Log the error
      logger.error('API Error:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });

      // Handle network errors
      if (!error.response) {
        throw new ApiError(0, AXIOS_ERROR_MESSAGES.NETWORK_ERROR);
      }

      // Handle timeout errors
      if (error.code === 'ECONNABORTED') {
        throw new ApiError(408, AXIOS_ERROR_MESSAGES.TIMEOUT_ERROR);
      }

      // Implement retry logic for specific status codes
      if (
        [408, 429, 500, 502, 503, 504].includes(error.response?.status) &&
        (!originalRequest._retry || originalRequest._retry < RETRY_ATTEMPTS)
      ) {
        originalRequest._retry = (originalRequest._retry || 0) + 1;

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

        return instance(originalRequest);
      }

      // Transform error to ApiError
      throw ApiError.fromResponse(error.response);
    },
  );

  return instance;
};
