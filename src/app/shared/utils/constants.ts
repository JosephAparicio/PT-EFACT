export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    TOKEN_TYPE: 'token_type',
    EXPIRES_IN: 'expires_in'
} as const;

export const API_ENDPOINTS = {
    OAUTH_TOKEN: '/oauth/token',
    CDR: '/v1/cdr',
    XML: '/v1/xml',
    PDF: '/v1/pdf'
} as const;

export const HTTP_HEADERS = {
    CONTENT_TYPE_FORM: 'application/x-www-form-urlencoded',
    CONTENT_TYPE_JSON: 'application/json'
} as const;

export const ERROR_MESSAGES = {
    AUTH_FAILED: 'Error de autenticación. Verifique sus credenciales.',
    NETWORK_ERROR: 'Error de conexión. Intente nuevamente.',
    GENERIC_ERROR: 'Ha ocurrido un error. Intente nuevamente.',
    FILE_LOAD_ERROR: 'Error: No se pudo cargar el archivo.',
    TIMEOUT_ERROR: 'Tiempo de espera agotado.',
    SESSION_EXPIRED: 'Sesión expirada. Redirigiendo...'
} as const;

export const MIME_TYPES = {
    PDF: 'application/pdf',
    XML: 'application/xml'
} as const;

export const FILE_PREFIXES = {
    DOCUMENT: 'documento_',
    CDR: 'cdr_'
} as const;

export const UI_MESSAGES = {
    LOADING_FILE: 'Cargando archivo... Por favor espera.',
    DOWNLOADING: 'Descargando'
} as const;

export const DOCUMENT_LABELS = {
    PDF: 'Documento',
    XML: 'XML',
    CDR: 'CDR'
} as const;
