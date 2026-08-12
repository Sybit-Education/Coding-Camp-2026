/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
