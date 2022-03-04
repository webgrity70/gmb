import { toast } from 'react-toastify';
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from '../constants';

export function notificationMessage(text, success = true) {
  toast.options = {
    positionClass: 'toast-top-right',
    hideDuration: 700,
    timeOut: 5000,
    extendedTimeOut: '1000',
    showEasing: 'swing',
    preventDuplicates: false,
    newestOnTop: false,
  };
  if (success) {
    setTimeout(() => toast.success(text), 300);
    return {
      type: SUCCESS_MESSAGE,
    };
  }
  setTimeout(() => toast.error(text), 300);
  return {
    type: ERROR_MESSAGE,
  };
}
