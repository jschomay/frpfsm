frpfsm = require("src/frpfsm");

// game states
startState = require("./start");
playState = require("./play");
endState = require("./end");

// define the transitions between states
frpfsm.loadState({
  name: "Start",
  fn: startState,
  transitions:{
    "begin": "Play"
  }
});

frpfsm.loadState({
  name: "Play",
  fn: playState,
  transitions: {
    "replay": "Play",
    "finish": "End"
    }
});

frpfsm.loadState({
  name: "End",
  fn: endState
});

debug = true;
currentState = frpfsm.start("Start", 0, debug);
// currentState.log("Entering state");
