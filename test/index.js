/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true es5: true node: true browser: true devel: true
         forin: true globalstrict: true */
'use strict';

var dsl = require('../choochoo')
var assert = require('assert')

var getPrototypeOf = Object.getPrototypeOf;

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

describe('module exports', function () {
  it('is a function', isA(dsl, 'function'));
  it('returns a function', isA(dsl({}), 'function'));
  it('contains lift utility', isA(dsl.lift, 'function'));
});

describe('constructor returned by chain', function () {
  var $ = dsl({
    'identity': function (thing) {
      return thing;
    },
    'x': function (num, factor) { return num * factor; },
    'mod': function (num, num2) { return num % num2; },
    'state1': true,
    'state2': false,
    'allowedStates': [ 'state1', 'state2' ]
  });

  it('returns an object', function () {
    assertType($(2), 'object');
  });

  it('contains predefined methods', function () {
    var chain = dsl({})
    assertType(chain().value, 'function')
    assertType(chain().valueOf, 'function')
  });

  it('constructs and returns a new object every time', function () {
    assert.notEqual($(2), $(2));
  });

  it('constructs objects from the same prototype', function () {
    var ins1 = $(1);
    var ins2 = $(2);

    assert.equal(getPrototypeOf(ins1), getPrototypeOf(ins2));
  });

  it('has chainable methods', function () {
    $(10).x(10).x(10).mod(3);
  });

  it('methods return object representing new state', function () {
     assertType($(10), "object");
     assertType($(10).x(10), "object");
     assertType($(10).x(10).x(10).mod(3), "object");
  });

  it("value method calculates computation", function () {
    assert.equal($(10).x(10).x(10).value(), 1000);
    assert.equal($(10).x(3).mod(3).value(), 0);
  });

  it("type conversion forces value calculation", function () {
    assert.equal($(10).x(10).x(10) + 1, 1001);
  });
});
