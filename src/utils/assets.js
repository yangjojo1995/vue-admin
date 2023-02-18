import CONFIG from '@/config'

export function assets (url, bucket = 'APP') {
  if (!url) return ''
  if (/^(?:https?:)?\/\//.test(url)) return url

  const defaultBase = CONFIG.ASSETS_BASE_URL
  const bucketBase = CONFIG[`ASSETS_BASE_URL_${bucket.toUpperCase()}`]
  const base = bucketBase || defaultBase

  if (base.indexOf('?') >= 0) {
    return base + url
  }
  return base.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
}

export default assets
