# recjs

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
[![Build Status](https://travis-ci.org/alexcambose/recjs.svg?branch=master)](https://travis-ci.org/alexcambose/recjs)

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
const recjs = new Recjs();
recjs.recorder.record(); // starts recording

setTimeout(() => {
    recjs.recorder.stop(); // stops recording after 3 seconds
    console.log(recjs.recorder.getData()) // gets recording data
}, 3000);
```

### Example 2

```javascript
const recjs = new Recjs();
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
<dt><a href="#Recorder">Recorder</a></dt>
<dd><p>Recorder class</p>
</dd>
<dt><a href="#Player">Player</a></dt>
<dd><p>Player class</p>
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
| [$0.events] | <code>array</code> | <code>[&#x27;scroll&#x27;, &#x27;mousemove&#x27;, &#x27;keypress&#x27;, &#x27;click&#x27;, &#x27;contextmenu&#x27;]</code> | User events that will be recorded |
| [$0.fps] | <code>integer</code> | <code>30</code> | Number of frames per second |
| [$0.document] | <code>object</code> | <code>window.document</code> | Document object to be used. (in case of an iframe) |

**Example**
```js
const recjs = new Recjs({
    events: ['scroll'],
    fps: 60
});
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

| Param | Type | Description |
| --- | --- | --- |
| [$0.onRecording] | <code>function</code> | Calls each recorded frame |

**Example**
```js
recjs.recorder.record({
   onRecording: () => console.log('Next frame')
})
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
<a name="Player"></a>

## Player
Player class

**Kind**: global class

* [Player](#Player)
    * [.play(data)](#Player+play)
    * [.pause()](#Player+pause)
    * [.stop()](#Player+stop)
    * [.setFrameIndex(index)](#Player+setFrameIndex)
    * [.currentFrame()](#Player+currentFrame) ⇒ <code>object</code>
    * [.currentFrameIndex()](#Player+currentFrameIndex) ⇒ <code>number</code>
    * [.isPlaying()](#Player+isPlaying) ⇒ <code>boolean</code>

<a name="Player+play"></a>

### player.play(data)
Starts playing a recording

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Recorded data |
| [$0.onPlaying] | <code>function</code> | Calls when playing finishes |
| [$0.onEnd] | <code>function</code> | Calls each frame |

**Example**
```js
recjs.player.play(recjs.recorder.getData(), {
   onEnd: () => console.log('Finished playing'),
   onPlaying: () => console.log('Next frame')
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
Set current frame

**Kind**: instance method of [<code>Player</code>](#Player)

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Frame index |

**Example**
```js
recjs.player.setFrameIndex(87)
```
<a name="Player+currentFrame"></a>

### player.currentFrame() ⇒ <code>object</code>
Get current frame

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>object</code> - Frame object
**Example**
```js
recjs.player.currentFrame()
```
<a name="Player+currentFrameIndex"></a>

### player.currentFrameIndex() ⇒ <code>number</code>
Get current frame index

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>number</code> - Frame index
**Example**
```js
recjs.player.currentFrameIndex()
```
<a name="Player+isPlaying"></a>

### player.isPlaying() ⇒ <code>boolean</code>
Is playing

**Kind**: instance method of [<code>Player</code>](#Player)
**Returns**: <code>boolean</code> - Returns true if it is playing
**Example**
```js
recjs.player.isPlaying()
```