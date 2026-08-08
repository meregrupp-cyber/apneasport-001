/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FACEBOOK_PAGE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
