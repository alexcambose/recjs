import Recorder from './Recorder';
import Player from './Player';
/*
available events: 'scroll', 'mousemove','keypress', 'click', 'contextmenu',
*/
class Recjs {
    constructor ({ el, events, fps }) {
        const availableEvents = ['scroll', 'mousemove', 'keypress', 'click', 'contextmenu'];
        this.events = events || availableEvents;
        this.events.forEach(event => {
            if (!availableEvents.includes(event)) console.warn(`Unknown event '${event}'`);
        });
        this.el = document.querySelector(el);
        this.fps = fps || 30;

        this.recorder = new Recorder(this.el, this.events, this.fps);
        this.player = new Player(this.el);
    }
}

export default Recjs;
