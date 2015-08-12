frpfsm = require("src/frpfsm");

// game states
startState = require("./start");
playState = require("./play");
endState = require("./end");

// define the transitions between states
frpfsm.loadState({
  name: "Start",
  state: startState,
  transitions:{
    "begin": playState
  }
});

frpfsm.loadState({
  name: "Play",
  state: playState,
  transitions: {
    "replay": playState,
    "finish": endState
    }
});

frpfsm.loadState({
  name: "End",
  state: endState
});

debug = true;
currentState = frpfsm.start(startState, 0, debug);
// currentState.log("Entering state");
