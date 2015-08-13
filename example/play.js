function randomNumberBetween(start, end) {
  return Math.floor(Math.random() * end) + start ;
}
function rollDie() {
  return randomNumberBetween(1, 6);
}
function sum(a, b) { return a + b; }
function report(text) {
  var el = document.createElement('div');
  el.innerText = text;
  document.querySelector('#report').appendChild(el);
}

// note, the first three arguments get partially applied in loadState
module.exports = function(winningThreshold, bid, walkAwayAmount, cashAtBeginingOfRound) {

  // roll 2 dice, one after the other
  var die1 = Kefir.later(1000).map(rollDie).take(1);
  var die2 = die1.delay(1000).map(rollDie).take(1);
  var rollTotal = Kefir.combine([die1, die2], sum);

  // side effects
  die1.onValue(function(value) {
    report('First roll: ' + value);
  });
  die2.onValue(function(value) {
    report('Second roll: ' + value);
  });

  // must return a stream that emits an event to change states
  return rollTotal
    .delay(1000)
    .map(function(rollTotal) {
      var newCash;
      var won = rollTotal > winningThreshold;
      if(won) {
        newCash = cashAtBeginingOfRound + bid;
      } else {
        newCash = Math.max(cashAtBeginingOfRound - bid, 0);
      }

      // side effect
      report('Roll total: ' + rollTotal + '. You ' + (won ? 'win' : 'lose') + '.  You now have $' + newCash + '.');

      // que next state
      if(newCash > 0 && newCash < walkAwayAmount) {
        return ['rollAgain', newCash];
      } else {
        return ['stopPlaying', newCash];
      }
    })
    .delay(2000);
};
