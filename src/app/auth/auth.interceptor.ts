import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // 👉 No agregues token en /authenticate
  if (req.url.includes('/authenticate')) {
    return next(req);
  }

  if (token) {
    const reqWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(reqWithToken);
  }

  return next(req);
};