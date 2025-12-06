import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-pdf-viewer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pdf-viewer.component.html',
    styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent {
    @Input() loading: boolean = false;

    private _pdfUrl: string | null = null;
    safePdfUrl: SafeResourceUrl | null = null;

    @Input()
    set pdfUrl(url: string | null) {
        this._pdfUrl = url;
        this.safePdfUrl = url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
    }

    get pdfUrl(): string | null {
        return this._pdfUrl;
    }

    constructor(private sanitizer: DomSanitizer) { }
}
