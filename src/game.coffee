# FRPFSM - Functionally Reactive Programming Finite State Machine


# TODO - wrap this up in a factory function
STATES =
  START: (data) -> Kefir.later(1000, ["begin", 0])
  PLAY: (count) ->
    Kefir
      .later(1000)
      .map -> if count < 3 then ["replay", count + 1] else ["finish"]
  END: (data) -> Kefir.never()

STATES.START["begin"] = STATES.PLAY
STATES.PLAY["replay"] = STATES.PLAY
STATES.PLAY["finish"] = STATES.END

STATES.START.label = "START"
STATES.PLAY.label = "PLAY"
STATES.END.label = "END"

enterState = ([state, initialData]) ->
  console.log "entering #{state.label} with data #{initialData}"
  state(initialData)
    .take(1)
    .map ([transition, exitData]) =>
      console.log "\"#{transition}\" transition with data #{exitData}"
      [state[transition], exitData]
    .flatMap(enterState)
    .toProperty(-> [state.label, initialData])

currentState = enterState [STATES.START]

# subscribe to initiate the stream
currentState.onAny(->)
