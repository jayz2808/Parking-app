/**
 * Open turn-by-turn directions to a coordinate in the user's preferred maps app.
 * Apple devices get Apple Maps; everything else gets Google Maps. Both fall back
 * to the web version if the native app isn't installed.
 */
export function openDirections(latitude: number, longitude: number) {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isApple = /iPhone|iPad|iPod|Macintosh/.test(ua);

  const url = isApple
    ? `https://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`
    : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}
