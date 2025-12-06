import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@shared/utils/constants';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private readonly http = inject(HttpClient);

    getCdr(ticket: string): Observable<Blob> {
        return this.http.get(
            `${environment.apiUrl}${API_ENDPOINTS.CDR}/${ticket}`,
            { responseType: 'blob' }
        ).pipe(
            catchError(error => this.handleError(error))
        );
    }

    getXml(ticket: string): Observable<Blob> {
        return this.http.get(
            `${environment.apiUrl}${API_ENDPOINTS.XML}/${ticket}`,
            { responseType: 'blob' }
        ).pipe(
            catchError(error => this.handleError(error))
        );
    }

    getPdf(ticket: string): Observable<Blob> {
        return this.http.get(
            `${environment.apiUrl}${API_ENDPOINTS.PDF}/${ticket}`,
            { responseType: 'blob' }
        ).pipe(
            catchError(error => this.handleError(error))
        );
    }

    blobToText(blob: Blob): Promise<string> {
        return blob.text();
    }

    createBlobUrl(blob: Blob): string {
        return URL.createObjectURL(blob);
    }

    revokeBlobUrl(url: string): void {
        URL.revokeObjectURL(url);
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error);
    }
}
