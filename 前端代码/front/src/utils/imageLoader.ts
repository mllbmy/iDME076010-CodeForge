function supportsWebP(): boolean {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
}

const webpSupported = supportsWebP();

export function getOptimizedImageUrl(jpgUrl: string): string {
  if (webpSupported) {
    return jpgUrl.replace(/\.jpg$/, '.webp').replace(/\.png$/, '.webp');
  }
  return jpgUrl;
}
