import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { DocumentService } from '@features/documents/services/document.service';
import { AuthService } from '@features/auth/services/auth.service';
import { DocumentType } from '@features/documents/models/document.models';
import { environment } from '@environments/environment';
import { XmlViewerComponent } from '@features/documents/components/xml-viewer/xml-viewer.component';
import { CdrViewerComponent } from '@features/documents/components/cdr-viewer/cdr-viewer.component';
import { PdfViewerComponent } from '@features/documents/components/pdf-viewer/pdf-viewer.component';
import { MIME_TYPES, FILE_PREFIXES, UI_MESSAGES, DOCUMENT_LABELS, ERROR_MESSAGES } from '@shared/utils/constants';

@Component({
    selector: 'app-document-viewer',
    standalone: true,
    imports: [CommonModule, XmlViewerComponent, CdrViewerComponent, PdfViewerComponent],
    templateUrl: './document-viewer.component.html',
    styleUrl: './document-viewer.component.css'
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
    private readonly documentService = inject(DocumentService);
    private readonly authService = inject(AuthService);
    private readonly TOAST_DURATION_MS = 4000;

    readonly DocumentType = DocumentType;
    readonly ticket = environment.demo.ticket;

    activeTab = signal<DocumentType>(DocumentType.PDF);
    loading = signal(false);
    errorMessage = signal<string | null>(null);
    toastMessage = signal<string | null>(null);

    xmlContent = signal<string | null>(null);
    cdrContent = signal<string | null>(null);
    pdfUrl = signal<string | null>(null);

    private xmlBlob: Blob | null = null;
    private cdrBlob: Blob | null = null;
    private pdfBlob: Blob | null = null;

    ngOnInit(): void {
        this.loadDocument(this.activeTab());
    }

    getTabLabel(tab: DocumentType): string {
        switch (tab) {
            case DocumentType.PDF:
                return DOCUMENT_LABELS.PDF;
            case DocumentType.XML:
                return DOCUMENT_LABELS.XML;
            case DocumentType.CDR:
                return DOCUMENT_LABELS.CDR;
        }
    }

    setActiveTab(tab: DocumentType): void {
        this.activeTab.set(tab);
        this.loadDocument(tab);
    }

    downloadFile(type: 'pdf' | 'xml' | 'cdr'): void {
        this.showToast(UI_MESSAGES.LOADING_FILE);

        this.ensureDocumentLoaded(type).subscribe({
            next: () => {
                this.performDownload(type);
            },
            error: () => {
                this.showToast(ERROR_MESSAGES.FILE_LOAD_ERROR);
            }
        });
    }

    private ensureDocumentLoaded(type: 'pdf' | 'xml' | 'cdr'): Observable<void> {
        switch (type) {
            case 'xml':
                return this.loadXml();
            case 'cdr':
                return this.loadCdr();
            case 'pdf':
                return this.loadPdf();
        }
    }

    private performDownload(type: 'pdf' | 'xml' | 'cdr'): void {
        let blob: Blob | null = null;
        let filename = '';
        let mimeType = '';

        switch (type) {
            case 'pdf':
                blob = this.pdfBlob;
                filename = `${FILE_PREFIXES.DOCUMENT}${this.ticket}.pdf`;
                mimeType = MIME_TYPES.PDF;
                break;
            case 'xml':
                blob = this.xmlBlob;
                filename = `${FILE_PREFIXES.DOCUMENT}${this.ticket}.xml`;
                mimeType = MIME_TYPES.XML;
                break;
            case 'cdr':
                blob = this.cdrBlob;
                filename = `${FILE_PREFIXES.CDR}${this.ticket}.xml`;
                mimeType = MIME_TYPES.XML;
                break;
        }

        if (!blob) {
            this.showToast(ERROR_MESSAGES.FILE_LOAD_ERROR);
            return;
        }

        const downloadBlob = new Blob([blob], { type: mimeType });
        const url = URL.createObjectURL(downloadBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 100);

        this.showToast(`${UI_MESSAGES.DOWNLOADING} ${filename}`);
    }

    private showToast(message: string): void {
        this.toastMessage.set(message);
        setTimeout(() => this.toastMessage.set(null), this.TOAST_DURATION_MS);
    }

    loadDocument(type: DocumentType): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        let loadObservable: Observable<void>;

        switch (type) {
            case DocumentType.XML:
                loadObservable = this.loadXml();
                break;
            case DocumentType.CDR:
                loadObservable = this.loadCdr();
                break;
            case DocumentType.PDF:
                loadObservable = this.loadPdf();
                break;
        }

        loadObservable.pipe(
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    private loadXml(): Observable<void> {
        if (this.xmlContent()) {
            return of(void 0);
        }

        return this.documentService.getXml(this.ticket).pipe(
            switchMap(blob => from(this.documentService.blobToText(blob)).pipe(
                map(text => {
                    this.xmlBlob = blob;
                    this.xmlContent.set(text);
                })
            )),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    private loadCdr(): Observable<void> {
        if (this.cdrContent()) {
            return of(void 0);
        }

        return this.documentService.getCdr(this.ticket).pipe(
            switchMap(blob => from(this.documentService.blobToText(blob)).pipe(
                map(text => {
                    this.cdrBlob = blob;
                    this.cdrContent.set(text);
                })
            )),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    private loadPdf(): Observable<void> {
        if (this.pdfUrl()) {
            return of(void 0);
        }

        return this.documentService.getPdf(this.ticket).pipe(
            tap(blob => {
                this.pdfBlob = blob;
                const url = this.documentService.createBlobUrl(blob);
                this.pdfUrl.set(url);
            }),
            map(() => void 0),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    private handleError(error: HttpErrorResponse): void {
        if (error.status === 401) {
            this.errorMessage.set(ERROR_MESSAGES.SESSION_EXPIRED);
            setTimeout(() => this.authService.logout(), 2000);
        } else {
            this.errorMessage.set(ERROR_MESSAGES.GENERIC_ERROR);
        }
    }

    logout(): void {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        if (this.pdfUrl()) {
            this.documentService.revokeBlobUrl(this.pdfUrl()!);
        }
    }
}
