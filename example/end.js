function report(text) {
  var el = document.createElement('div');
  el.innerText = text;
  document.querySelector('#report').appendChild(el);
}

module.exports = function(remainingCash){
  if(remainingCash === 0) {
    report('Bummer, you lost all your money!');
  } else {
    report('You won $' + remainingCash + ', nice!');
  }
  report('(Refresh to play again)');
  return Kefir.never();
};
