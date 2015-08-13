var frpfsm = require("src/frpfsm");

var config = {
  startingAmount: 20,
  walkAwayAmount: 50,
  bid: 5,
  winningThreshold: 7,
};

// game states
var preloadState = require("./preload");
var playState = require("./play");
var endState = require("./end");

// define the states and transitions
frpfsm.loadState({
  name: "Preload",
  fn: preloadState,
  transitions:{
    "loaded": "Play"
  }
});

// note, partially applying the config values to playState
frpfsm.loadState({
  name: "Play",
  fn: playState.bind(playState, config.winningThreshold, config.bid, config.walkAwayAmount),
  transitions: {
    "rollAgain": "Play",
    "stopPlaying": "GameOver"
    }
});

frpfsm.loadState({
  name: "GameOver",
  fn: endState
});

// start the state machine
var debug = true;
var fsm = frpfsm.start("Preload", config.startingAmount, debug);
// fsm.log("State machine events stream");
