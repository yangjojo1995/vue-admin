import ClipboardJS from 'clipboard'

class Queue {
  constructor (worker, concurrency) {
    this.tasks = []
    this.worker = typeof worker === 'function' ? worker : null
    this.concurrencyMax = typeof concurrency === 'number' && concurrency > 0 ? concurrency : 1
    this.concurrencyCut = 0
    this.drain = null

    this._id = 0
  }

  _start () {
    if (this.tasks.length === 0 || this.concurrencyCut >= this.concurrencyMax) return
    const tasksEvent = this.tasks.shift()
    this.concurrencyCut += 1
    this.worker && this.worker(tasksEvent.task, this._next.bind(this, tasksEvent))
  }

  _next (tasksEvent, ...args) {
    if (tasksEvent.__$isComplete) return
    tasksEvent.__$isComplete = true
    const { callback } = tasksEvent
    callback && callback.apply(this, args)
    this.concurrencyCut -= 1
    if (this.tasks.length > 0) { return this._start() }
    if (this.concurrencyCut === 0) { return this.drain && this.drain() }
  }

  push (task, callback) {
    const id = ++this._id
    this.tasks.push({ id, task, callback })
    if (this.concurrencyCut < this.concurrencyMax) this._start()
    return id
  }

  remove (id) {
    const index = this.tasks.findIndex(item => item.id === id)
    if (index >= 0) {
      this.tasks.splice(index, 1)
    }
  }
}

const buttonId = 'a2f0babeca934657942f1f5acfee79fc'

const button = document.createElement('button')

button.setAttribute('id', buttonId)
button.setAttribute('style', 'position: fixed;left: -100000px;top: -100000px;width: 0;overflow: hidden;height: 0;')
button.setAttribute('data-clipboard-text', '')
button.setAttribute('data-clipboard-action', 'copy')

document.body.appendChild(button)

const clipboard = new ClipboardJS(`#${buttonId}`)

let copyTextMap = null

clipboard.on('success', function (e) {
  copyTextMap && copyTextMap.resolve(e)
  copyTextMap = null
})

clipboard.on('error', function (e) {
  copyTextMap && copyTextMap.reject(e)
  copyTextMap = null
})

const copyTextQueue = new Queue(function (task, next) {
  copyTextMap = {
    resolve: e => next(null, e),
    reject: e => next(e)
  }
  button.setAttribute('data-clipboard-text', task)
  button.click()
}, 1)

function copyText (text) {
  return new Promise((resolve, reject) => {
    copyTextQueue.push(text, (error, e) => {
      return error ? reject(error) : resolve(e)
    })
  })
}

copyText.isSupported = function () {
  return ClipboardJS.isSupported()
}

export default copyText
