fsm = require("../src/fsm");

startState = function() { return Kefir.later(1000, ["begin", 0]); };
playState = function(count) {
    return Kefir
      .later(1000)
      .map(function(){ return count < 3 ? ["replay", count + 1] : ["finish"]; });
};
endState = function(){ return Kefir.never(); };

fsm.loadState({
  name: "Start",
  state: startState,
  transitions:{
    "begin": playState
  }
});

fsm.loadState({
  name: "Play",
  state: playState,
  transitions: {
    "replay": playState,
    "finish": endState
    }
});

fsm.loadState({
  name: "End",
  state: endState
});

currentState = fsm.start(startState, 0, true);
// currentState.log("Entering state");
