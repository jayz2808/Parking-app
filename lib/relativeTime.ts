/**
 * Convert a timestamp into a short human-friendly "time ago" string,
 * e.g. "just now", "5 min ago", "2 hr ago", "3 days ago".
 */
export function timeAgo(timestamp?: string | null): string {
  if (!timestamp) return 'no reports yet';

  const then = new Date(timestamp).getTime();
  if (Number.isNaN(then)) return 'unknown';

  const seconds = Math.floor((Date.now() - then) / 1000);

  if (seconds < 0) return 'just now';
  if (seconds < 45) return 'just now';
  if (seconds < 90) return '1 min ago';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
