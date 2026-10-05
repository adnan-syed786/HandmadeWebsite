import { apiUrl } from './api';

export function imageUrl(path = '') {
  if (!path) return '/Images/placeholder.png';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const normalizedPath = String(path).trim().replace(/\\/g, '/');
  if (normalizedPath.startsWith('uploads/')) {
    return apiUrl(`/${normalizedPath}`);
  }
  return normalizedPath.startsWith('/uploads/')
    ? apiUrl(normalizedPath)
    : normalizedPath.startsWith('/')
      ? normalizedPath
      : `/${normalizedPath}`;
}
