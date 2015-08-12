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
require.register("src/frpfsm", function(exports, require, module) {
var STATES, enterState;

STATES = {};

enterState = function(debug, arg) {
  var initialData, state;
  state = arg[0], initialData = arg[1];
  if (debug) {
    console.debug("Enter " + (STATES[state].name.toUpperCase()) + " with initial data " + initialData);
  }
  return state(initialData).take(1).map((function(_this) {
    return function(arg1) {
      var exitData, nextState, transition;
      transition = arg1[0], exitData = arg1[1];
      if (debug) {
        console.debug("Exit " + (STATES[state].name.toUpperCase()) + " with transition \"" + transition + "\"");
      }
      nextState = STATES[state].transitions[transition];
      return [nextState, exitData];
    };
  })(this)).flatMap(enterState.bind(this, debug)).toProperty(function() {
    return [STATES[state].name, initialData];
  });
};

module.exports = {
  loadState: function(stateConfig) {
    return STATES[stateConfig.state] = {
      name: stateConfig.name,
      transitions: stateConfig.transitions
    };
  },
  start: function(state, initialData, debug) {
    var currentState;
    if (debug == null) {
      debug = false;
    }
    currentState = enterState(debug, [state, initialData]);
    return currentState.onAny(function() {});
  }
};

});

