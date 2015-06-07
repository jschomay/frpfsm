module.exports = function(count) {
  return Kefir
    .later(1000)
    .map(function(){ return count < 3 ? ["replay", count + 1] : ["finish"]; });
};
