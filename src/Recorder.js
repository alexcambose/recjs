import Loop from './Loop';

class Recorder {
    constructor (el, events, fps) {
        this.el = el;
        this.events = events;
        this.fps = fps;
        this._recording = false;
        this._data = {
            fps,
            frames: []
        };
        this._dataIndex = 0;
        this._animationId = null;

        this._mouseX = null;
        this._mouseY = null;
        this._clickX = null;
        this._clickY = null;
        this._contextX = null;
        this._contextY = null;
        this._scrollX = null;
        this._scrollY = null;
        this._keypress = null;
        if (events.indexOf('click') !== -1) {
            el.addEventListener('click', e => {
                this._clickX = Math.floor(e.clientX - el.getBoundingClientRect().left);
                this._clickY = Math.floor(e.clientY - el.getBoundingClientRect().top);
            });
        }
        if (events.indexOf('contextmenu') !== -1) {
            el.addEventListener('contextmenu', e => {
                this._contextX = Math.floor(e.clientX - el.getBoundingClientRect().left);
                this._contextY = Math.floor(e.clientY - el.getBoundingClientRect().top);
            });
        }
        if (events.indexOf('mousemove') !== -1) {
            el.addEventListener('mousemove', e => {
                this._mouseX = Math.floor(e.clientX - el.getBoundingClientRect().left);
                this._mouseY = Math.floor(e.clientY - el.getBoundingClientRect().top);
            });
        }
        if (events.indexOf('scroll') !== -1) {
            el.addEventListener('scroll', e => {
                this._scrollX = el.scrollLeft;
                this._scrollY = el.scrollTop;
            });
        }
        if (events.indexOf('keypress') !== -1) {
            document.addEventListener('keypress', e => {
                this._keypress = e.keyCode;
            });
            document.addEventListener('keydown', e => {
                if (e.keyCode === 8) this._keypress = 8;
            });
        }
        this._loop = new Loop(fps, this._appendFrame.bind(this));
    }
    record () {
        this._record();
    }
    isRecording () {
        return this._recording;
    }
    stop () {
        this.pause();
        this._dataIndex = 0;
    }
    pause () {
        this._recording = false;
        this._loop.stop();
    }
    getData (stringify = false) {
        if (stringify) return JSON.stringify(this._data);
        return this._data;
    }
    _record () {
        this._recording = true;
        this._loop.start();
    }
    _appendFrame () {
        let newFrame = {};
        if (this.events.indexOf('click') !== -1) {
            newFrame.clickX = this._clickX;
            newFrame.clickY = this._clickY;
            this._clickX = null;
            this._clickY = null;
        }
        if (this.events.indexOf('contextmenu') !== -1) {
            newFrame.contextX = this._contextX;
            newFrame.contextY = this._contextY;
            this._contextX = null;
            this._contextY = null;
        }
        if (this.events.indexOf('mousemove') !== -1) {
            newFrame.mouseX = this._mouseX;
            newFrame.mouseY = this._mouseY;
        }
        if (this.events.indexOf('scroll') !== -1) {
            newFrame.scrollX = this._scrollX;
            newFrame.scrollY = this._scrollY;
        }
        if (this.events.indexOf('keypress') !== -1) {
            newFrame.keypress = this._keypress;
            this._keypress = null;
        }
        this._data.frames.push(newFrame);
    }
}

export default Recorder;
