import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { formatXml } from '@shared/utils/xml-formatter';

@Component({
    selector: 'app-cdr-viewer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cdr-viewer.component.html',
    styleUrl: './cdr-viewer.component.css'
})
export class CdrViewerComponent {
    @Input() content: string | null = null;
    @Input() loading: boolean = false;

    copied = signal(false);

    constructor(private sanitizer: DomSanitizer) { }

    get formattedContent(): string {
        return this.content ? formatXml(this.content) : '';
    }

    get formattedLines(): string[] {
        return this.formattedContent.split('\n');
    }

    get highlightedContent(): SafeHtml {
        const formatted = this.formattedContent;

        let highlighted = formatted
            .replace(/(&lt;\/?)(\w+)(.*?&gt;)/g, '<span class="xml-tag">$1$2</span><span class="xml-attr">$3</span>')
            .replace(/(\w+)=/g, '<span class="xml-attr-name">$1</span>=')
            .replace(/="([^"]*)"/g, '=<span class="xml-attr-value">"$1"</span>')
            .replace(/(&lt;!--.*?--&gt;)/g, '<span class="xml-comment">$1</span>')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        return this.sanitizer.bypassSecurityTrustHtml(highlighted);
    }

    copyToClipboard(): void {
        if (this.content) {
            navigator.clipboard.writeText(this.content);
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        }
    }
}
