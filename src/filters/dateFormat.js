
import dayjs from 'dayjs'

/**
 * 时间格式化
 *
 * dateFormat(1627873349014) => "2021-08-02 11:02:29"
 *
 * @param {number|string|date} datetime 时间
 * @param {string} fmt 格式化模板，默认：YYYY-MM-DD HH:mm:ss
 * @returns string
 */
export function dateFormat (datetime, fmt) {
  if (datetime) {
    return dayjs(datetime).format(fmt || 'YYYY-MM-DD HH:mm:ss')
  } else {
    return '-'
  }
}

export default dateFormat
