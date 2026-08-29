/** Strip quotes and whitespace from Vite env values (.env files often include quotes by mistake). */
export function readEnvValue(value: unknown): string {
  if (typeof value !== 'string') return '';
  let trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

export function readEnvUrl(value: unknown): string {
  return readEnvValue(value).replace(/\/+$/, '');
}
