fsm = require "../src/fsm"

startState = -> Kefir.later(1000, ["begin", 0])
playState = (count) ->
    Kefir
      .later(1000)
      .map -> if count < 3 then ["replay", count + 1] else ["finish"]
endState = -> Kefir.never()

fsm.loadState
  name: "Start"
  state: startState
  transitions:
    "begin": playState

fsm.loadState
  name: "Play"
  state: playState
  transitions:
    "replay": playState
    "finish": endState

fsm.loadState
  name: "End"
  state: endState

currentState = fsm.start startState, 0
# currentState.log()
