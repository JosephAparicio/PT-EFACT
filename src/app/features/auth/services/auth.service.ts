import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { StorageService } from '@core/services/storage.service';
import { LoginCredentials, TokenResponse, AuthState } from '@features/auth/models/auth.models';
import { API_ENDPOINTS, HTTP_HEADERS } from '@shared/utils/constants';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly storage = inject(StorageService);
    private readonly router = inject(Router);

    private authState$ = new BehaviorSubject<AuthState>({
        isAuthenticated: this.storage.hasToken(),
        token: this.storage.getToken()
    });

    getAuthState(): Observable<AuthState> {
        return this.authState$.asObservable();
    }

    login(credentials: LoginCredentials): Observable<TokenResponse> {
        const headers = new HttpHeaders({
            'Authorization': environment.oauth.basicAuth,
            'Content-Type': HTTP_HEADERS.CONTENT_TYPE_FORM
        });

        const body = new URLSearchParams({
            grant_type: environment.oauth.grantType,
            username: credentials.username,
            password: credentials.password
        });

        return this.http.post<TokenResponse>(
            `${environment.apiUrl}${API_ENDPOINTS.OAUTH_TOKEN}`,
            body.toString(),
            { headers }
        ).pipe(
            tap(response => this.handleLoginSuccess(response)),
            catchError(error => this.handleError(error))
        );
    }

    logout(): void {
        this.storage.clear();
        this.authState$.next({
            isAuthenticated: false,
            token: null
        });
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return this.storage.hasToken();
    }

    getToken(): string | null {
        return this.storage.getToken();
    }

    private handleLoginSuccess(response: TokenResponse): void {
        this.storage.setToken(response.access_token);
        this.authState$.next({
            isAuthenticated: true,
            token: response.access_token
        });
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error);
    }
}
