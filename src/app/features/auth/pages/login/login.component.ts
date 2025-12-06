import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@features/auth/services/auth.service';
import { LoginCredentials } from '@features/auth/models/auth.models';
import { ERROR_MESSAGES } from '@shared/utils/constants';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    loginForm: FormGroup;
    loading = signal(false);
    errorMessage = signal<string | null>(null);
    submitted = false;

    constructor() {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    get username() {
        return this.loginForm.get('username');
    }

    get password() {
        return this.loginForm.get('password');
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        const credentials: LoginCredentials = {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password
        };

        this.authService.login(credentials).subscribe({
            next: () => {
                this.loading.set(false);
                this.router.navigate(['/documents']);
            },
            error: (error: HttpErrorResponse) => {
                this.loading.set(false);
                if (error.status === 401) {
                    this.errorMessage.set(ERROR_MESSAGES.AUTH_FAILED);
                } else {
                    this.errorMessage.set(ERROR_MESSAGES.GENERIC_ERROR);
                }
            }
        });
    }
}
