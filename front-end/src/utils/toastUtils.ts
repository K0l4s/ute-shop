import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success', options: ToastOptions = {}) => {
  const toastOptions = { ...defaultOptions, ...options };
  if (type === 'success') {
    toast.success(message, toastOptions);
  } else if (type === 'error') {
    toast.error(message, toastOptions);
  } else if (type === 'info') {
    toast.info(message, toastOptions);
  }
};