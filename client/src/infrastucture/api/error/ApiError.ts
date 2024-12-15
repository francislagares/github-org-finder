export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: any): ApiError {
    return new ApiError(
      response?.status || 500,
      response?.data?.message || 'An unexpected error occurred',
      response?.data,
      response?.data?.code,
    );
  }
}
