import { Routes } from '@angular/router';
import { DocumentViewerComponent } from './pages/document-viewer/document-viewer.component';
import { authGuard } from '@core/guards/auth.guard';

export const documentsRoutes: Routes = [
    {
        path: 'documents',
        component: DocumentViewerComponent,
        canActivate: [authGuard]
    }
];
