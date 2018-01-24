import Loop from './Loop'

/** Player class */
class Player {
  constructor (document) {
    this.el = document.scrollingElement;
    this.document = document
    this._dataFrameIndex = 0
    this._loop = null
    this._playing = false
    this._onPlaying = null
    this._onEnd = null
    this._previousElementFocused = null
  }
  /**
     * Starts playing a recording
     * @example
     * recjs.player.play(recjs.recorder.getData(), {
     *    onEnd: () => console.log('Finished playing'),
     *    onPlaying: () => console.log('Next frame')  
     * })
     * @param  {object} data - Recorded data
     * @param  {function} [$0.onPlaying] - Calls when playing finishes
     * @param  {function} [$0.onEnd] - Calls each frame
     */
  play (data, { onPlaying, onEnd }) {
    this.data = data
    this._onPlaying = onPlaying
    this._onEnd = onEnd
    this._loop = new Loop(data.fps, this._renderFrame.bind(this))
    this._playing = true
    this._loop.start()
  }
  /**
     * Pauses playing
     * @example
     * recjs.player.pause()
     */
  pause () {
    this._loop.stop()
    this._playing = false
  }
  /**
     * Stops playing
     * @example
     * recjs.player.stop()
     */
  stop () {
    this.pause()
    this._dataFrameIndex = 0
    this._renderFrame() // render once more with the initial frame
  }
  /**
     * Set current frame
     * @example
     * recjs.player.setFrameIndex(87)
     * @param  {number} index - Frame index
     */
  setFrameIndex (index) {
    if (index < this._dataFrameIndex.length) {
      this._dataFrameIndex = index
    } else {
      console.warn(`Can't set frame index to ${index}, only ${this._dataFrameIndex.length - 1} available!`)
    }
  }
  /**
     * Get current frame
     * @example
     * recjs.player.currentFrame()
     * @returns {object} Frame object
     */
  currentFrame () {
    return this.data.frames[this._dataFrameIndex]
  }
  /**
     * Get current frame index
     * @example
     * recjs.player.currentFrameIndex()
     * @returns {number} Frame index
     */
  currentFrameIndex () {
    return this._dataFrameIndex
  }
  /**
     * Is playing
     * @example
     * recjs.player.isPlaying()
     * @returns {boolean} Returns true if it is playing
     */
  isPlaying () {
    return this._playing
  }
  _renderFrame () {
    if (this._dataFrameIndex > this.data.frames.length - 1) {
      this.stop()      
      if (this._onEnd) this._onEnd()
      return
    }
    if (this._dataFrameIndex === 0) { // initialize
      this.el.scrollTop = this.el.scrollLeft = 0
      const pointer = this.document.getElementById('recjs-pointer')
      if (pointer) pointer.remove()
    }
    const frame = this.data.frames[this._dataFrameIndex]
    if (frame.mouseX !== null && frame.mouseY !== null) {
      this._mouseMove(frame.mouseX, frame.mouseY)
    }
    if (frame.clickX !== null && frame.clickY !== null) {
      this._fireClick(frame.clickX, frame.clickY)
    }
    if (frame.contextX !== null && frame.contextY !== null) {
      this._fireContextMenu(frame.contextX, frame.contextY)
    }
    if (frame.scrollY) this.el.scrollTop = frame.scrollY
    if (frame.scrollX) this.el.scrollLeft = frame.scrollX
    if (frame.keypress) this._keypress(frame.keypress)
    this._dataFrameIndex++
    if(this._onPlaying) this._onPlaying();
  }

  _fireClick (x, y) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint
    const absX = x - window.pageXOffset
    const absY = y - window.pageYOffset
    // we must get the emene tbehind the recjs-pointer so we do x - 1 and y - 1
    const element = this.document.elementFromPoint(absX, absY - 1)
    if (element && element.tagName.toLowerCase() === 'input') {
      element.focus()
      this._previousElementFocused = element
    } else {
      element.click()
      if (this._previousElementFocused) this._previousElementFocused.blur()
    }
    this._addDot(x, y, 'recjs-clickdot', 'red')
  }
  _fireContextMenu (x, y) {
    this._addDot(x, y, 'recjs-contextkdot', 'blue')
  }
  _mouseMove (x, y) {
    let pointer = this.document.getElementById('recjs-pointer')
    if (!pointer) {
      pointer = this.document.createElement('div')
      pointer.id = 'recjs-pointer'
      pointer.style.position = 'absolute'
      pointer.style.width = '14px'
      pointer.style.height = '21px'
      pointer.style.zIndex = '999'
      pointer.style.backgroundImage = 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiICAgaWQ9InN2ZzIiICAgc29kaXBvZGk6ZG9jbmFtZT0iTW91c2UgQ3Vyc29yIEFyb3cgKEZpeGVkKS5zdmciICAgdmlld0JveD0iMCAwIDcyMC43MTA4OSAxMDc5LjQ0OTIiICAgdmVyc2lvbj0iMS4xIiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTEgcjEzNzI1IiAgIHdpZHRoPSI3MjAuNzEwODgiICAgaGVpZ2h0PSIxMDc5LjQ0OTIiPiAgPGRlZnMgICAgIGlkPSJkZWZzMTMzIiAvPiAgPHNvZGlwb2RpOm5hbWVkdmlldyAgICAgaWQ9ImJhc2UiICAgICBmaXQtbWFyZ2luLWxlZnQ9IjAiICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iZmFsc2UiICAgICBpbmtzY2FwZTp6b29tPSIwLjUiICAgICBoZWlnaHQ9IjBweCIgICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIgICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMiIgICAgIGlua3NjYXBlOmN4PSItNTUyLjA3MjE3IiAgICAgaW5rc2NhcGU6Y3k9IjY3OS42OTIzMSIgICAgIGlua3NjYXBlOm9iamVjdC1wYXRocz0idHJ1ZSIgICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiAgICAgaW5rc2NhcGU6c25hcC1iYm94PSJmYWxzZSIgICAgIHNob3dncmlkPSJmYWxzZSIgICAgIHdpZHRoPSIwcHgiICAgICBpbmtzY2FwZTpkb2N1bWVudC11bml0cz0icHgiICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIgICAgIGlua3NjYXBlOndpbmRvdy14PSIwIiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjE5IiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIgICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIgICAgIGlua3NjYXBlOmJib3gtcGF0aHM9InRydWUiICAgICBpbmtzY2FwZTpiYm94LW5vZGVzPSJ0cnVlIiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTA2MSIgICAgIHNob3dib3JkZXI9ImZhbHNlIiAgICAgZml0LW1hcmdpbi10b3A9IjAiICAgICBpbmtzY2FwZTpzbmFwLWludGVyc2VjdGlvbi1wYXRocz0idHJ1ZSIgICAgIGlua3NjYXBlOm9iamVjdC1ub2Rlcz0idHJ1ZSIgICAgIGlua3NjYXBlOnNuYXAtc21vb3RoLW5vZGVzPSJ0cnVlIj4gICAgPGlua3NjYXBlOmdyaWQgICAgICAgdHlwZT0ieHlncmlkIiAgICAgICBpZD0iZ3JpZDQzNTkiICAgICAgIGVtcHNwYWNpbmc9IjUwIiAgICAgICBvcmlnaW54PSIwIiAgICAgICBvcmlnaW55PSI1OC43MzgzMiIgLz4gIDwvc29kaXBvZGk6bmFtZWR2aWV3PiAgPGcgICAgIGlkPSJsYXllcjIiICAgICBpbmtzY2FwZTpsYWJlbD0iTGF5ZXIiICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU1NS4xODk5LC0xMTIuMDg4MzYpIj4gICAgPHBhdGggICAgICAgc3R5bGU9ImNvbG9yOiMwMDAwMDA7Zm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6bWVkaXVtO2xpbmUtaGVpZ2h0Om5vcm1hbDtmb250LWZhbWlseTpzYW5zLXNlcmlmO3RleHQtaW5kZW50OjA7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWRlY29yYXRpb246bm9uZTt0ZXh0LWRlY29yYXRpb24tbGluZTpub25lO3RleHQtZGVjb3JhdGlvbi1zdHlsZTpzb2xpZDt0ZXh0LWRlY29yYXRpb24tY29sb3I6IzAwMDAwMDtsZXR0ZXItc3BhY2luZzpub3JtYWw7d29yZC1zcGFjaW5nOm5vcm1hbDt0ZXh0LXRyYW5zZm9ybTpub25lO2RpcmVjdGlvbjpsdHI7YmxvY2stcHJvZ3Jlc3Npb246dGI7d3JpdGluZy1tb2RlOmxyLXRiO2Jhc2VsaW5lLXNoaWZ0OmJhc2VsaW5lO3RleHQtYW5jaG9yOnN0YXJ0O3doaXRlLXNwYWNlOm5vcm1hbDtjbGlwLXJ1bGU6bm9uemVybztkaXNwbGF5OmlubGluZTtvdmVyZmxvdzp2aXNpYmxlO3Zpc2liaWxpdHk6dmlzaWJsZTtvcGFjaXR5OjE7aXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO2NvbG9yLWludGVycG9sYXRpb246c1JHQjtjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM6bGluZWFyUkdCO3NvbGlkLWNvbG9yOiMwMDAwMDA7c29saWQtb3BhY2l0eToxO2ZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTAwO3N0cm9rZS1saW5lY2FwOnNxdWFyZTtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO2NvbG9yLXJlbmRlcmluZzphdXRvO2ltYWdlLXJlbmRlcmluZzphdXRvO3NoYXBlLXJlbmRlcmluZzphdXRvO3RleHQtcmVuZGVyaW5nOmF1dG87ZW5hYmxlLWJhY2tncm91bmQ6YWNjdW11bGF0ZSIgICAgICAgZD0ibSA1NTUuMTg5OSwxMTIuMDg4MzYgMCwxMjAuNzEwOTQgMCw5MjAuNzEwOSAyMzIuNDIxODgsLTIzMi40MjE4NCAxMTEuOTA0MjksMjcwLjQ0OTI0IDE2OS43NjM2MywtODQuODgyOCAtMTE0LjA5MzcxLC0yNzMuODU1NSAzMjAuNzE0ODEsMCB6IiAgICAgICBpZD0icGF0aDQzOTIiICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjIiAvPiAgICA8cGF0aCAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxIiAgICAgICBkPSJNIDUwLDUwIDUwLDg1MCAyNTAsNjUwIDM2OS45OTYwOSw5NDAuMDAxOTUgNDQ5Ljk4ODI4LDkwMC4wMDU4NiAzMjUsNjAwIGwgMjc1LDAgeiIgICAgICAgaWQ9InJlY3Q1NiIgICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjYyIgICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTU1LjE4OTksMTgyLjc5OTMpIiAvPiAgPC9nPiAgPG1ldGFkYXRhICAgICBpZD0ibWV0YWRhdGExMzEiPiAgICA8cmRmOlJERj4gICAgICA8Y2M6V29yaz4gICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PiAgICAgICAgPGRjOnR5cGUgICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+ICAgICAgICA8Y2M6bGljZW5zZSAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvIiAvPiAgICAgICAgPGRjOnB1Ymxpc2hlcj4gICAgICAgICAgPGNjOkFnZW50ICAgICAgICAgICAgIHJkZjphYm91dD0iaHR0cDovL29wZW5jbGlwYXJ0Lm9yZy8iPiAgICAgICAgICAgIDxkYzp0aXRsZT5PcGVuY2xpcGFydDwvZGM6dGl0bGU+ICAgICAgICAgIDwvY2M6QWdlbnQ+ICAgICAgICA8L2RjOnB1Ymxpc2hlcj4gICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPiAgICAgICAgPGRjOmRhdGU+MjAxMS0xMi0yMFQwNDozMDowNDwvZGM6ZGF0ZT4gICAgICAgIDxkYzpkZXNjcmlwdGlvbj5BIHBpeGVsLWFydCBzdHlsZSBhcnJvdyBtb3VzZSBjdXJzb3IuIE1hZGUgdXAgb2YgaW5kaXZpZHVhbCBzcXVhcmVzLCBmb3IgZWFzeSBtYW5pcHVsYXRpb248L2RjOmRlc2NyaXB0aW9uPiAgICAgICAgPGRjOnNvdXJjZT5odHRwczovL29wZW5jbGlwYXJ0Lm9yZy9kZXRhaWwvMTY2MzU2L21vdXNlLWN1cnNvci0tLWFycm93LWJ5LWhlbGxvY2F0Zm9vZDwvZGM6c291cmNlPiAgICAgICAgPGRjOmNyZWF0b3I+ICAgICAgICAgIDxjYzpBZ2VudD4gICAgICAgICAgICA8ZGM6dGl0bGU+aGVsbG9jYXRmb29kPC9kYzp0aXRsZT4gICAgICAgICAgPC9jYzpBZ2VudD4gICAgICAgIDwvZGM6Y3JlYXRvcj4gICAgICAgIDxkYzpzdWJqZWN0PiAgICAgICAgICA8cmRmOkJhZz4gICAgICAgICAgICA8cmRmOmxpPmFycm93PC9yZGY6bGk+ICAgICAgICAgICAgPHJkZjpsaT5jdXJzb3I8L3JkZjpsaT4gICAgICAgICAgICA8cmRmOmxpPm1vdXNlPC9yZGY6bGk+ICAgICAgICAgICAgPHJkZjpsaT5waXhlbDwvcmRmOmxpPiAgICAgICAgICA8L3JkZjpCYWc+ICAgICAgICA8L2RjOnN1YmplY3Q+ICAgICAgPC9jYzpXb3JrPiAgICAgIDxjYzpMaWNlbnNlICAgICAgICAgcmRmOmFib3V0PSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9wdWJsaWNkb21haW4vemVyby8xLjAvIj4gICAgICAgIDxjYzpwZXJtaXRzICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zI1JlcHJvZHVjdGlvbiIgLz4gICAgICAgIDxjYzpwZXJtaXRzICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zI0Rpc3RyaWJ1dGlvbiIgLz4gICAgICAgIDxjYzpwZXJtaXRzICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zI0Rlcml2YXRpdmVXb3JrcyIgLz4gICAgICA8L2NjOkxpY2Vuc2U+ICAgIDwvcmRmOlJERj4gIDwvbWV0YWRhdGE+PC9zdmc+)'
      pointer.style.backgroundSize = 'cover'
      this.el.appendChild(pointer)
    }
    pointer.style.top = y + this.el.scrollTop + 'px'
    pointer.style.left = x + this.el.scrollLeft + 'px'
  }
  _keypress (keycode) {
    if (this._previousElementFocused) {
      if (keycode === 8) { // backspace
        const value = this._previousElementFocused.value
        this._previousElementFocused.value = value.substring(0, value.length - 1)
      } else {
        this._previousElementFocused.value += String.fromCharCode(keycode)
      }
    }
  }
  _addDot (x, y, className, color) {
    let dot = this.document.createElement('recjs')
    dot.className = className
    dot.style.position = 'absolute'
    dot.style.width = '10px'
    dot.style.height = '10px'
    dot.style.backgroundColor = color
    dot.style.opacity = '.6'
    dot.style.zIndex = '999'    
    dot.style.borderRadius = '100%'
    dot.style.top = y + this.el.scrollTop + 'px'
    dot.style.left = x + this.el.scrollLeft + 'px'
    this.el.appendChild(dot)
    setTimeout(() => {
      dot.remove()
    }, 3000)
  }
}

export default Player
