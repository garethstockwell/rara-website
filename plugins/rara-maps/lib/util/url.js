// URL-mangling utilities

const PLACEHOLDER = "%{RARA_MAPS}";

export function absUrl(url) {
  if (url.startsWith(PLACEHOLDER)) {
    return raraMapsData.baseUrl + url.slice(PLACEHOLDER.length);
  }
  return url;
}
