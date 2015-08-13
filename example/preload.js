module.exports = function(startingCash) {
  // do preloading stuff here...
  
  // return a stream that emits an event after half a second (fake preload)
  return Kefir.later(500, ["loaded", startingCash]); 
};
