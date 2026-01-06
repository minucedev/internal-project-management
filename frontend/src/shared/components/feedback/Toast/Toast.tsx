import { toast as hotToast, type ToastOptions } from 'react-hot-toast';



// Wrapper for toast functions to allow easy replacement or extension later
export const toast = {
  success: (message: string, options?: ToastOptions) => hotToast.success(message, options),
  error: (message: string, options?: ToastOptions) => hotToast.error(message, options),
  loading: (message: string, options?: ToastOptions) => hotToast.loading(message, options),
  dismiss: (toastId?: string) => hotToast.dismiss(toastId),
  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    opts?: ToastOptions
  ) => hotToast.promise(promise, msgs, opts),
};
