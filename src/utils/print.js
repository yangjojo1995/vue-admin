import printJS from 'print-js'

// 唯一id
function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 是否Dom
function isHTMLElement (element) {
  if (typeof HTMLElement === 'object') {
    return element instanceof HTMLElement
  }
  return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === 'string'
}

// https://printjs.crabbly.com/
export default function () {
  if (!arguments[0]) return

  let config = {}
  if (typeof arguments[0] === 'string') {
    config.printable = arguments[0]
    config.type = arguments[1] || 'pdf'
  } else if (isHTMLElement(arguments[0])) {
    config.printable = arguments[0]
    config.type = 'html'
  } else if (typeof arguments[0] === 'object') {
    config = { ...arguments[0] }
  } else {
    return
  }

  // 兼容 node 选择器
  if (config.type === 'html') {
    let el = config.printable
    if (typeof el === 'string') el = document.querySelector(el)
    if (!el.id) el.id = 'print_' + guid()

    const ignoreElements = []

    if (Array.isArray(config.ignoreElements)) {
      for (const path of config.ignoreElements) {
        const ignoreEls = el.querySelectorAll(path)
        for (const ignoreEl of ignoreEls) {
          if (!ignoreEl.id) ignoreEl.id = 'print_' + guid()
          ignoreElements.push(ignoreEl.id)
        }
      }
    }

    config.printable = el.id
    config.ignoreElements = ignoreElements
  }

  if (config.type === 'json') {
    if (!config.properties && config.printable && config.printable[0]) {
      config.properties = Object.keys(config.printable[0])
    }
    if (!config.gridHeaderStyle) {
      config.gridHeaderStyle = 'border: 1px solid lightgray; padding: 4px 8px;'
    }
    if (!config.gridStyle) {
      config.gridStyle = 'border: 1px solid lightgray; margin-bottom: -1px; padding: 4px 8px;'
    }
    config.printable = config.printable.map(item => {
      item = { ...item }
      for (const propertie of config.properties) {
        if (!propertie) continue
        if (propertie.field && propertie.transform) {
          item[propertie.field] = propertie.transform(item[propertie.field])
        }
      }
      return item
    })
  }

  return printJS(config)
}
