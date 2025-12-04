// URL-mangling utilities

const PLACEHOLDER = '%{RARA_MAPS}';

export function absUrl(url) {
  if (url.startsWith(PLACEHOLDER)) {
    // eslint-disable-next-line no-undef
    return raraMapsData.baseUrl + url.slice(PLACEHOLDER.length);
  }
  return url;
}
