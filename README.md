# frpfsm (FRP Finite State Machine)

A small and simple FRP streams based state machine with a nice API for defining and transitioning states.  Built on top of kefir.js.

## Concept

Each state is a factory function that takes initial data and returns a stream that emits a single event when it wants to transition to a different state, specifying the transition name and exit data.  Frpfsm connects all the state streams together.

## Usage

Initializing your states and transitions:

```javascript

```

Define your states:
```javascript
// each state is just a function that takes initial data and must return
// a kefir.js stream that emits an event // with the transition name and
// exit data when it is time to change states
```

TODO - example is you start with $20 and roll the dice.  If the total is greater than a random number you double your money, otherwise you half it.  Keep rerolling until you run out of money (go to lose state), or make 100 (go to win state).
