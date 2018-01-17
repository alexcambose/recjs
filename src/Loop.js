class Loop {
  constructor (fps, callback) {
    this.fps = fps
    this.callback = callback
    this._loopId = null
  }
  start () {
    const interval = 1000 / this.fps
    let now
    let then = Date.now()
    const loop = () => {
      this._loopId = window.requestAnimationFrame(loop)
      now = Date.now()
      if (interval < now - then) {
        then = now - ((now - then) % interval)
        this.callback()
      }
    }
    loop()
  }
  stop () {
    window.cancelAnimationFrame(this._loopId)
  }
}

export default Loop
