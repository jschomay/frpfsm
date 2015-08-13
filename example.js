(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});
  if (!WebSocket || ar.disabled) return;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel="stylesheet"][href]:not([data-autoreload="false"]'))
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function() { document.body.offsetHeight; }, 25);
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();

require.register("example/end", function(exports, require, module) {
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

  // "stop" the state machine
  return Kefir.never();
};

});

require.register("example/example", function(exports, require, module) {
var frpfsm = require("src/frpfsm");

var config = {
  startingAmount: 20,
  walkAwayAmount: 50,
  bid: 10,
  winningThreshold: 7,
};

// game states
var preloadState = require("./preload");
var startState = require("./start");
var playState = require("./play");
var endState = require("./end");

// define the states and transitions
frpfsm.loadState({
  name: "Preload",
  fn: preloadState,
  transitions:{
    "loaded": "Start"
  }
});

frpfsm.loadState({
  name: "Start",
  fn: startState,
  transitions:{
    "readyToPlay": "Play"
  }
});

// note, partially applying the config values to playState
frpfsm.loadState({
  name: "Play",
  fn: playState.bind(playState, config.winningThreshold, config.bid, config.walkAwayAmount),
  transitions: {
    "rollAgain": "Play",
    "stopPlaying": "GameOver"
    }
});

frpfsm.loadState({
  name: "GameOver",
  fn: endState
});

// start the state machine
var debug = true;
var fsm = frpfsm.start("Preload", config.startingAmount, debug);
// fsm.log("State machine events stream");

});

require.register("example/play", function(exports, require, module) {
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
    });
};

});

require.register("example/preload", function(exports, require, module) {
module.exports = function(startingCash) {
  // do preloading stuff here...
  
  // return a stream that emits an event after half a second (fake preload)
  return Kefir.later(500, ["loaded", startingCash]); 
};

});

require.register("example/start", function(exports, require, module) {
module.exports = function(startingCash) {

  // return stream that emmits a transition event when the play button is clicked
  return Kefir.fromEvents(document.querySelector('#start'), 'click')
    .map(function() {
      return ["readyToPlay", startingCash]; 
    });
};

});

