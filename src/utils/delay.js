/**
 * 等待延迟
 * @param {number} time 延迟时间
 */
function delay (time) {
  return new Promise((resolve, reject) => {
    return setTimeout(resolve, time)
  })
}

export { delay }
export default delay
