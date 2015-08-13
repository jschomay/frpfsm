module.exports = function(startingCash) {
  // do preloading stuff here...
  return Kefir.later(500, ["loaded", startingCash]); 
};
