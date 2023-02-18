/**
 * 去除两边空格
 * 使用 <el-input v-model="xxx" v-trim></el-input>
 */
function getInput (el) {
  let inputEle
  const currentName = el.children[0].tagName
  console.log(el.children[0].tagName)
  if (currentName === 'INPUT') {
    inputEle = el.querySelector('input')
  } else if (currentName === 'TEXTAREA') {
    inputEle = el.querySelector('textarea')
  } else {
    inputEle = el
  }
  return inputEle
}
function dispatchEvent (el, type) {
  const evt = document.createEvent('HTMLEvents')
  evt.initEvent(type, true, true)
  el.dispatchEvent(evt)
}
const trim = {
  inserted: el => {
    const inputEle = getInput(el)

    const handler = function (event) {
      console.log(event)
      const newVal = event.target.value.trim()
      if (event.target.value !== newVal) {
        event.target.value = newVal
        dispatchEvent(inputEle, 'input')
        dispatchEvent(inputEle, 'textarea')
      }
    }
    el.inputEle = inputEle
    el._blurHandler = handler
    if (inputEle) {
      inputEle.addEventListener('blur', handler)
    }
  },
  unbind (el) {
    const { inputEle } = el
    inputEle.removeEventListener('blur', el._blurHandler)
  }
}
export default trim
