/* global define, it, describe */
const assert = require('chai').assert;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<body>
        <div id="main"></div>
    </body>`);
global.window = dom.window;
global.document = dom.window.document;

const Recjs = require('../dist/dist.js').default;
const recjs = new Recjs({
    el: '#main'
});

describe('recjs', function () {
    it('default events if not specified', function () {
        assert.deepEqual(recjs.events, ['scroll', 'mousemove', 'keypress', 'click', 'contextmenu']);
    });
    it('default fps if not specified', function () {
        assert.equal(recjs.fps, 30);
    });
    it('instance of player class', function () {
        assert.typeOf(recjs.player, 'object', 'player class');
    });
    it('instance of recorder class', function () {
        assert.typeOf(recjs.recorder, 'object', 'recorder class');
    });
});
