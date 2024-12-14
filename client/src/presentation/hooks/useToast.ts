import { useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';

const defaultToastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const useToast = () => {
  const showInfoMessage = useCallback((message: string) => {
    toast.info(message, defaultToastOptions);
  }, []);

  const showSuccessMessage = useCallback((message: string) => {
    toast.success(message, defaultToastOptions);
  }, []);

  const showErrorMessage = useCallback((message: string) => {
    toast.error(message, defaultToastOptions);
  }, []);

  return {
    showInfoMessage,
    showSuccessMessage,
    showErrorMessage,
  };
};
