/**
 * 金额
 *
 * 例子：money(1000000) => "$1,000,000"
 *
 * @param {number} value 数值
 * @param {string} prefix 前缀（符号）
 * @param {string} suffix 后缀（单位）
 * @param {number} decimal 保留小数位数，默认：2
 * @returns string
 */
export function money (value, prefix = '', suffix = '', decimal = 2) {
  if (isNaN(Number(value))) return value
  const number = Number(value).toFixed(decimal)
  const thousands = number.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')
  return prefix + thousands + suffix
}

export default money
