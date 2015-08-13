function randomNumberBetween(start, end) {
  return Math.floor(Math.random() * end) + start ;
}
function rollDie() {
  return randomNumberBetween(1, 6);
}
function sum(a, b) { return a + b; }

// note, the first three arguments get partially applied in loadState
module.exports = function(winningThreshold, bid, walkAwayAmount, cashAtBeginingOfRound) {
  // roll 2 dice, one after the other
  var die1 = Kefir.later(1000).map(rollDie).take(1);
  var die2 = die1.delay(1000).map(rollDie).take(1);
  var rollTotal = Kefir.combine([die1, die2], sum);

  die1.log("First roll");
  die2.log("Second roll");
  rollTotal.log("Roll total");

  // must return a stream that emits an event to change states
  return rollTotal
    .delay(500)
    .map(function(rollTotal) {
      var newCash;
      if(rollTotal > winningThreshold) {
        newCash = cashAtBeginingOfRound + bid;
      } else {
        newCash = Math.max(cashAtBeginingOfRound - bid, 0);
      }

      // que next state
      if(newCash > 0 && newCash < walkAwayAmount) {
        return ["rollAgain", newCash];
      } else {
        return ["stopPlaying", newCash];
      }
    });
};
