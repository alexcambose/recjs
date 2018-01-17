import Recorder from './Recorder'
import Player from './Player'
/*
available events: 'scroll', 'mousemove','keypress', 'click', 'contextmenu',
*/
/*
* Main class
*/
class Recjs {
  /**
     * @example
     * const recjs = new Recjs({
     *     el: '#someElement',
     *     events: ['scroll'],
     *     fps: 60
     * });
     * @param {Object} $0
     * @param  {string} $0.el - Target element that is going to be recorded
     * @param  {array} [$0.events=['scroll', 'mousemove', 'keypress', 'click', 'contextmenu']] - User events that will be recorded
     * @param  {integer} [$0.fps=30] - Number of frames per second
     * @param  {object} [$0.document=window.document] - Document object to be used. (in case of an iframe)
     */
  constructor ({ el, events, fps, document }) {
    const availableEvents = ['scroll', 'mousemove', 'keypress', 'click', 'contextmenu']
    this.events = events || availableEvents
    this.events.forEach(event => {
      if (!availableEvents.includes(event)) console.warn(`Unknown event '${event}'`)
    })
    this.document = document || window.document
    this.el = this.document.querySelector(el)
    this.fps = fps || 30

    this.recorder = new Recorder(this.el, this.document, this.events, this.fps)
    this.player = new Player(this.el, this.document)
  }
}

export default Recjs
