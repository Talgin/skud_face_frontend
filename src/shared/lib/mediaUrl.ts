// Event images are stored with MinIO's direct address (http://<server ip>:<minio port>/<bucket>/<object>),
// which browsers outside the server's network can't reach. nginx serves the same objects at /media/<bucket>/<object>.
export function mediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/")) return url;
  try {
    const { pathname } = new URL(url);
    return /^\/[^/]+-bucket\//.test(pathname) ? `/media${pathname}` : url;
  } catch {
    return url;
  }
}
