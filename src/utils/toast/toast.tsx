import Swal, { type SweetAlertIcon } from 'sweetalert2';

// Toast Configuration (Mixin)
const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  showCloseButton: true,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
    //toast.addEventListener('click', () => Swal.close());
  },
});

// Toast Functions
export const showToast = (message: string, icon: SweetAlertIcon = 'success') => {
  toast.fire({
    icon: icon,
    title: message,
  });
};

export const showSuccessToast = (message: string) => showToast(message, 'success');
export const showErrorToast = (message: string) => showToast(message, 'error');
export const showWarningToast = (message: string) => showToast(message, 'warning');
export const showInfoToast = (message: string) => showToast(message, 'info');
export const showQuestionToast = (message: string) => showToast(message, 'question');

// Alert Functions
export const showConfirmAlert = (title = '', desc = '') => {
  return Swal.fire({
    title: title,
    html: desc,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    icon: 'question',
     customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-secendary',
    },
  });
};

export const showSuccessAlert = (title = '', desc = '') => {
  return Swal.fire({
    title: title,
    text: desc,
    confirmButtonText: 'OK',
    confirmButtonColor: '#03A415',
    icon: 'success',
  });
};

export const showErrorAlert = (title = '', desc = '') => {
  return Swal.fire({
    title: title,
    text: desc,
    icon: 'error',
  });
};

export const showWarningAlert = (title = '', desc = '') => {
  return Swal.fire({
    title: title,
    text: desc,
    icon: 'warning',
  });
};

export const showQuestionAlert = (title = '', desc = '') => {
  return Swal.fire({
    title: title,
    text: desc,
    icon: 'question',
  });
};
