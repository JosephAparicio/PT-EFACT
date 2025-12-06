import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '@core/services/storage.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const storage = inject(StorageService);
    const token = storage.getToken();

    if (token && !req.url.includes('/oauth/token')) {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedRequest);
    }

    return next(req);
};
