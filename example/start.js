module.exports = function(startCount) {
  // just begins the next state after 1 second with the startCount
  return Kefir.later(1000, ["begin", startCount]); 
};
