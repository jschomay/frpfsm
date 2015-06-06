# FRPFSM - Functionally Reactive Programming Finite State Machine

STATES = {}

enterState = (debug, [state, initialData]) ->
  if debug
    console.debug "Enter #{STATES[state].name.toUpperCase()} with initial data #{initialData}"
  state(initialData)
    .take(1)
    .map ([transition, exitData]) =>
      if debug
        console.debug "Exit #{STATES[state].name.toUpperCase()} with transition \"#{transition}\""
      nextState = STATES[state].transitions[transition]
      [nextState, exitData]
    .flatMap(enterState.bind this, debug)
    .toProperty(-> [STATES[state].name, initialData])



module.exports =
  loadState: (stateConfig) ->
    # (using state's function as key)
    STATES[stateConfig.state] =
      name: stateConfig.name
      transitions: stateConfig.transitions

  start: (state, initialData, debug = false) ->
    currentState = enterState debug, [state, initialData]
    # subscribe to initiate the stream
    currentState.onAny(->)
