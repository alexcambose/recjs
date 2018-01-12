# recjs
Lightweight user session recorder based on JSON

## Installation
In browser:

```html
<script src="dist/dist.js"></script>
```

In Node.js

```bash
npm install --save @alexcambose/recjs
```

```javascript
import Recjs from 'recjs';
```

## Usage

```html
...
<body>
    <div id="someElement"></div>
</body>
...
```

### Example 1

```javascript
const recjs = new Recjs({
    el: '#someElement',
});
recjs.recorder.record(); // starts recording

setTimeout(() => {
    recjs.recorder.stop(); // stops recording after 3 seconds
    console.log(recjs.recorder.getData()) // gets recording data
}, 3000);
```

### Example 2

```javascript
const recjs = new Recjs({
    el: '#someElement',
});
recjs.recorder.record(); // starts recording

setTimeout(() => {
    recjs.recorder.stop(); // stops recording after 3 seconds
    recjs.player.play(recjs.recorder.getData(), () => console.log('Finished')); // plays current recording and logs when finishes
}, 3000);
```

## API Reference

## Classes

<dl>
<dt><a href="#Recjs">Recjs</a></dt>
<dd></dd>
<dt><a href="#Player">Player</a></dt>
<dd><p>Player class</p>
</dd>
<dt><a href="#Recorder">Recorder</a></dt>
<dd><p>Recorder class</p>
</dd>
</dl>

<a name="Recjs"></a>

## Recjs
**Kind**: global class
<a name="new_Recjs_new"></a>

### new Recjs($0)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| $0 | <code>Object</code> |  |  |
| $0.el | <code>string</code> |  | Target element that is going to be recorded |
| [$0.events] | <code>array</code> | <code>[&#x27;scroll&#x27;, &#x27;mousemove&#x27;, &#x27;keypress&#x27;, &#x27;click&#x27;, &#x27;contextmenu&#x27;]</code> | User events that will be recorded |
| [$0.fps] | <code>integer</code> | <code>30</code> | Number of frames per second |
| [$0.document] | <code>object</code> | <code>window.document</code> | Document object to be used. (in case of an iframe) |

**Example**
```js
const recjs = new Recjs({
    el: '#someElement',
    events: ['scroll'],
    fps: 60
});
```
<a name="Player"></a>

## Player
Player class

**Kind**: global class

* [Player](#Player)
    * [.play(data, onEnd)](#Player+play)
    * [.pause()](#Player+pause)
    * [.stop()](#Player+stop)
    * [.setFrameIndex(index)](#Player+setFrameIndex)

<a name="Player+play"></a>

### player.play(data, onEnd)
Starts playing a recording

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Recorded data |
| onEnd | <code>function</code> | Calls when playing finishes |

**Example**
```js
recjs.player.play(recjs.recorder.getData(), () => {
    console.log('Finished playing')
})
```
<a name="Player+pause"></a>

### player.pause()
Pauses playing

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
recjs.player.pause()
```
<a name="Player+stop"></a>

### player.stop()
Stops playing

**Kind**: instance method of [<code>Player</code>](#Player)
**Example**
```js
recjs.player.stop()
```
<a name="Player+setFrameIndex"></a>

### player.setFrameIndex(index)
Sets current frame

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Frame index |

**Example**
```js
recjs.player.setFrameIndex(87)
```
<a name="Recorder"></a>

## Recorder
Recorder class

**Kind**: global class

* [Recorder](#Recorder)
    * [.record()](#Recorder+record)
    * [.isRecording()](#Recorder+isRecording) ⇒ <code>boolean</code>
    * [.stop()](#Recorder+stop)
    * [.pause()](#Recorder+pause)
    * [.getData(stringify)](#Recorder+getData) ⇒ <code>object</code> \| <code>string</code>

<a name="Recorder+record"></a>

### recorder.record()
Starts recording

**Kind**: instance method of [<code>Recorder</code>](#Recorder)
**Example**
```js
recjs.recorder.record()
```
<a name="Recorder+isRecording"></a>

### recorder.isRecording() ⇒ <code>boolean</code>
Check if it is recording

**Kind**: instance method of [<code>Recorder</code>](#Recorder)
**Returns**: <code>boolean</code> - True if it's recording
**Example**
```js
recjs.recorder.isRecording()
```
<a name="Recorder+stop"></a>

### recorder.stop()
Stops recording

**Kind**: instance method of [<code>Recorder</code>](#Recorder)
**Example**
```js
recjs.recorder.stop()
```
<a name="Recorder+pause"></a>

### recorder.pause()
Pauses current recording

**Kind**: instance method of [<code>Recorder</code>](#Recorder)
**Example**
```js
recjs.recorder.pause()
```
<a name="Recorder+getData"></a>

### recorder.getData(stringify) ⇒ <code>object</code> \| <code>string</code>
Returns recorded data

**Kind**: instance method of [<code>Recorder</code>](#Recorder)

| Param | Type | Default |
| --- | --- | --- |
| stringify | <code>boolean</code> | <code>false</code> |

**Example**
```js
recjs.recorder.getData(true)
```