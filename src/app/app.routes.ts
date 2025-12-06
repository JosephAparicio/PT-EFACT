import { Routes } from '@angular/router';
import { authRoutes } from '@features/auth/auth.routes';
import { documentsRoutes } from '@features/documents/documents.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    ...authRoutes,
    ...documentsRoutes,
    {
        path: '**',
        redirectTo: 'login'
    }
];
