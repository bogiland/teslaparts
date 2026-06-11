const defaultApiBaseUrl = import.meta.env.DEV ? "http://localhost:3000" : "";

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL ?? defaultApiBaseUrl;
}

export function apiUrl(path: string) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return path;
  }

  return `${baseUrl}${path}`;
}
