import Loop from './Loop'

/** Recorder class */
class Recorder {
  constructor (document, events, fps) {
    this.el = document.scrollingElement
    this.document = document
    this.events = events
    this.fps = fps
    this._recording = false
    this._onRecording = null
    this._data = {
      fps,
      frames: []
    }
    this._dataIndex = 0
    this._animationId = null

    this._mouseX = null
    this._mouseY = null
    this._clickX = null
    this._clickY = null
    this._contextX = null
    this._contextY = null
    this._scrollX = null
    this._scrollY = null
    this._keypress = null
    if (events.indexOf('click') !== -1) {
      this.el.addEventListener('click', e => {
        this._clickX = e.clientX
        this._clickY = e.clientY
      })
    }
    if (events.indexOf('contextmenu') !== -1) {
      this.el.addEventListener('contextmenu', e => {
        this._contextX = e.clientX
        this._contextY =e.clientY
      })
    }
    if (events.indexOf('mousemove') !== -1) {
      this.el.addEventListener('mousemove', e => {
        this._mouseX = e.clientX
        this._mouseY = e.clientY
      })
    }
    if (events.indexOf('scroll') !== -1) {
      this.document.addEventListener('scroll', e => {
        this._scrollX = this.el.scrollLeft
        this._scrollY = this.el.scrollTop
      })
    }
    if (events.indexOf('keypress') !== -1) {
      this.document.addEventListener('keypress', e => {
        this._keypress = e.keyCode
      })
      this.document.addEventListener('keydown', e => {
        if (e.keyCode === 8) this._keypress = 8
      })
    }
    this._loop = new Loop(fps, this._appendFrame.bind(this))
  }
  /**
     * Starts recording
     * @param  {function} [$0.onRecording] Calls each recorded frame
     * @example
     * recjs.recorder.record({
     *    onRecording: () => console.log('Next frame')
     * })
     */
  record ({ onRecording }) {
    this._onRecording = onRecording;    
    this._record()
  }
  /**
     * Check if it is recording
     * @example
     * recjs.recorder.isRecording()
     * @returns {boolean} True if it's recording
     */
  isRecording () {
    return this._recording
  }
  /**
     * Stops recording
     * @example
     * recjs.recorder.stop()
     */
  stop () {
    this.pause()
    this._dataIndex = 0
  }
  /**
     * Pauses current recording
     * @example
     * recjs.recorder.pause()
     */
  pause () {
    this._recording = false
    this._loop.stop()
  }
  /**
     * Returns recorded data
     * @example
     * recjs.recorder.getData(true)
     * @param  {boolean} stringify=false
     * @returns {(object|string)}
     */
  getData (stringify = false) {
    if (stringify) return JSON.stringify(this._data)
    return this._data
  }
  _record () {
    this._recording = true
    this._loop.start()
  }
  _appendFrame () {
    let newFrame = {}
    if (this.events.indexOf('click') !== -1) {
      newFrame.clickX = this._clickX
      newFrame.clickY = this._clickY
      this._clickX = null
      this._clickY = null
    }
    if (this.events.indexOf('contextmenu') !== -1) {
      newFrame.contextX = this._contextX
      newFrame.contextY = this._contextY
      this._contextX = null
      this._contextY = null
    }
    if (this.events.indexOf('mousemove') !== -1) {
      newFrame.mouseX = this._mouseX
      newFrame.mouseY = this._mouseY
    }
    if (this.events.indexOf('scroll') !== -1) {
      newFrame.scrollX = this._scrollX
      newFrame.scrollY = this._scrollY
    }
    if (this.events.indexOf('keypress') !== -1) {
      newFrame.keypress = this._keypress
      this._keypress = null
    }
    this._data.frames.push(newFrame)
    if(this._onRecording) this._onRecording();
  }
}

export default Recorder
