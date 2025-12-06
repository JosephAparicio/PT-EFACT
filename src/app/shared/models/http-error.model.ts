export interface HttpError {
    status: number;
    statusText: string;
    message: string;
    error?: unknown;
}
