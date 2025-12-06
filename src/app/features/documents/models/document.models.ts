export interface DocumentRequest {
    ticket: string;
}

export interface DocumentResponse {
    data: Blob;
    contentType: string;
}

export enum DocumentType {
    XML = 'xml',
    CDR = 'cdr',
    PDF = 'pdf'
}

export interface DocumentViewerState {
    activeTab: DocumentType;
    loading: boolean;
    error: string | null;
}
