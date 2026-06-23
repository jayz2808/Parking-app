/**
 * Share a deep link to a specific parking spot. Uses the native share sheet
 * on mobile when available; otherwise copies the link to the clipboard.
 * Returns 'shared', 'copied', or 'failed' so the UI can give feedback.
 */
export async function shareSpot(
  cityId: string,
  spotId: string,
  streetName: string
): Promise<'shared' | 'copied' | 'failed'> {
  const url = `${window.location.origin}/?city=${cityId}&spot=${spotId}`;
  const text = `Parking at ${streetName}`;

  try {
    if (navigator.share) {
      await navigator.share({ title: 'Parking Spots', text, url });
      return 'shared';
    }
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch (err) {
    // User cancelling the share sheet throws — treat as no-op
    if (err instanceof Error && err.name === 'AbortError') return 'shared';
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'failed';
    }
  }
}
