export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 100);
}

export function isValidBusStopCode(code: string): boolean {
  return /^[0-9]{5}$/.test(code.trim());
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>&"']/g, '')
    .trim()
    .slice(0, 50);
}
