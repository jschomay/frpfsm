# FRPFSM - Functionally Reactive Programming Finite State Machine

STATES = {}

enterState = ([state, initialData]) ->
  console.log "entering #{STATES[state].name.toUpperCase()} with data #{initialData}"
  state(initialData)
    .take(1)
    .map ([transition, exitData]) =>
      console.log "\"#{transition}\" transition with data #{exitData}"
      nextState = STATES[state].transitions[transition]
      [nextState, exitData]
    .flatMap(enterState)
    .toProperty(-> [STATES[state].name, initialData])



module.exports =
  loadState: (stateConfig) ->
    # (using state's function as key)
    STATES[stateConfig.state] =
      name: stateConfig.name
      transitions: stateConfig.transitions

  start: (state, initialData) ->
    currentState = enterState [state, initialData]
    # subscribe to initiate the stream
    currentState.onAny(->)
