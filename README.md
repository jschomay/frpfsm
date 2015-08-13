# frpfsm (FRP Finite State Machine)

A small and simple Functionally Reactive Programming (streams) based state machine with a nice API for defining and transitioning states.  Built on top of <a href="https://rpominov.github.io/kefir/">kefir.js</a>.

## Concept

Each state is a factory function that takes initial data and returns a stream that emits a single event when it wants to transition to a different state, specifying the transition name and exit data.  frpfsm connects all the state streams together.

## Usage

Initializing your states and transitions:

```javascript
frpfsm.loadState({
  name: "Preload",
  fn: preloadState,
  transitions:{
    "loaded": "Start"
  }
});

frpfsm.loadState({
  name: "Start",
  fn: startState,
  transitions:{
    "readyToPlay": "Play"
    "changeSettings": "Settings"
  }
});

// etc...

```

Define your states:
```javascript
startState = function(startingValue) {
  // do other state stuff...

  // return stream that emmits a transition event when the play button is clicked
  return Kefir.fromEvents(document.querySelector('#start'), 'click')
  .map(function() {
    return ["readyToPlay", startingValue]; 
  });
};
```

Start the machine:
```javascript
var debug = true;
frpfsm.start("Preload", startingValue, debug);
```

See `example.js` for a complete example.
