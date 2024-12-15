export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const isAxiosError = (error: unknown): boolean => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    error.isAxiosError === true
  );
};

export const handleApiError = (error: unknown): string => {
  if (isAxiosError(error)) {
    // Handle specific API error responses
    const axiosError = error as any;
    return axiosError.response?.data?.message || 'API request failed';
  }
  return getErrorMessage(error);
};
