/**
 * label
 * @param {*} value 值
 * @param {array} list 列表
 * @param {string} valueKey value key
 * @param {string} labelKey label key
 * @returns {string}
 */
export function label (value, list, valueKey = 'value', labelKey = 'label') {
  if (value == null) return ''
  const item = list.find(item => {
    let itemValue = item[valueKey]
    if (typeof itemValue === 'number') itemValue = String(itemValue)
    return itemValue === String(value)
  })
  return item ? item[labelKey] : value
}
export function labels (value, list, valueKey = 'itemValue', labelKey = 'itemName') {
  if (value == null || !value) return '-'
  const item = list.find(item => {
    let itemValue = item[valueKey]
    if (typeof itemValue === 'number') itemValue = String(itemValue)
    return itemValue === String(value)
  })
  return item ? item[labelKey] : value
}
export default label
