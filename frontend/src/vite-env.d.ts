/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Express backend, including /api/v1. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
