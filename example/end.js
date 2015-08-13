module.exports = function(remainingCash){
  if(remainingCash === 0) {
    console.log("Bummer, you lost all your money!");
  } else {
    console.log("You won $" + remainingCash + ", nice!");
  }
  return Kefir.never();
};
