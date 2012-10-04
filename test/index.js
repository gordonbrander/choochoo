/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint es5: true node: true browser: true devel: true
         forin: true globalstrict: true */
'use strict';

var daisy = require('../daisychain.js');
var assert = require('assert');

// Function wrapper for type assertion.
function assertType(x, y) {
  return assert.equal(typeof(x), y);
}

// Convenience wrapper for checking types.
// Returns a type assertion wrapped in a function, so it may be passed directly
// to `it()`.
function isA(x, y) {
  return function () { assertType(x, y); }
}

describe('uid', function () {
  it('returns a value that may be used as a key', isA(daisy.uid(), 'string'));
});

describe('chain', function () {
  it('is a function', isA(daisy.chain, 'function'));
  it('returns a function', isA(daisy.chain({}), 'function'));
});
