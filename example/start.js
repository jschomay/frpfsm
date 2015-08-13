module.exports = function(startingCash) {

  // return stream that emmits a transition event when the play button is clicked
  return Kefir.fromEvents(document.querySelector('#start'), 'click')
    .map(function() {
      return ["readyToPlay", startingCash]; 
    });
};
