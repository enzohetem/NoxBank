export function xsrfHeader(): Record<string, string> {
  try {
    const cookie = document.cookie.split('; ').find((row) => row.startsWith('XSRF-TOKEN='))
    if (!cookie) return {}
    const value = decodeURIComponent(cookie.split('=')[1] || '')
    return value ? { 'X-XSRF-TOKEN': value } : {}
  } catch {
    return {}
  }
}
