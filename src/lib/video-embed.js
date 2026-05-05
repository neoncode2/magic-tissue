function extractYouTubeId(value) {
  const input = value.trim();

  if (!input) {
    return '';
  }

  const directMatch = input.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );

  if (directMatch?.[1]) {
    return directMatch[1];
  }

  try {
    const url = new URL(input);

    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '').trim();
    }

    if (url.hostname.includes('youtube.com')) {
      const byQuery = url.searchParams.get('v');
      if (byQuery) return byQuery.trim();

      const segments = url.pathname.split('/').filter(Boolean);
      const candidate = segments[segments.length - 1];
      return candidate?.trim() || '';
    }
  } catch {
    return '';
  }

  return '';
}

function normalizeVideoEmbedUrl(rawUrl = '') {
  const input = String(rawUrl || '').trim();
  if (!input) return '';

  const youtubeId = extractYouTubeId(input);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  const lowered = input.toLowerCase();
  if (lowered.includes('facebook.com/plugins/video.php')) {
    return input;
  }

  if (lowered.includes('facebook.com') || lowered.includes('fb.watch')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      input
    )}&show_text=false&autoplay=false`;
  }

  return input;
}

export { normalizeVideoEmbedUrl };
