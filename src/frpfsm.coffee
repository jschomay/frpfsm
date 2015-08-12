# FRPFSM - Functionally Reactive Programming Finite State Machine

STATES = {}

enterState = (debug, [stateName, initialData]) ->
  requestedState = STATES[stateName]
  if debug
    console.debug "Enter #{stateName.toUpperCase()} with initial data #{initialData}"
  requestedState.fn(initialData)
    .take(1)
    .map ([transition, exitData]) =>
      if debug
        console.debug "Exit #{stateName.toUpperCase()} with transition \"#{transition}\" and exit data #{exitData}"
      nextState = requestedState.transitions[transition]
      [nextState, exitData]
    .flatMap(enterState.bind this, debug)
    .toProperty(-> [stateName, initialData])



module.exports =
  loadState: (stateConfig) ->
    STATES[stateConfig.name] =
      fn: stateConfig.fn
      transitions: stateConfig.transitions

  start: (stateName, initialData, debug = false) ->
    currentState = enterState debug, [stateName, initialData]
    # subscribe to initiate the stream
    currentState.onAny(->)
