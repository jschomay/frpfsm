# TODO
# - have states return a key for the state instead of the function
# - or use the transition mapper
# - log state name instead of function
# - test with more states
# - pull out into separate file?
# - use actual states

STATES =
START: (data) -> Kefir.later(1000, [STATES.PLAY])
PLAY: (data) -> Kefir.later(2000, [STATES.START, "You won"])

count = 0
nextState = ([next, scope]) ->
  # temp infinite loop breaker
  if count++ > 3
    console.log "finish"
    return Kefir.never()
  transitionTo = next scope
  transitionTo
    .take(1)
    .flatMap(nextState)
    .toProperty(-> [next, scope])

currentState = nextState [STATES.START, "start"]

currentState.log("Entering state")
