/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint es5: true node: true browser: true devel: true
         forin: true globalstrict: true */
'use strict';

var choochoo = require('../choochoo.js'),
    getFunctionKeys = choochoo.getFunctionKeys,
    createMethodsHash = choochoo.createMethodsHash,
    uid = choochoo.uid,
    chain = choochoo.chain,
    box = choochoo.box,
    unbox = choochoo.unbox;

var assert = require('assert');

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

describe('uid', function () {
  it('returns a value that may be used as a key', isA(uid(), 'string'));
  
  it('does not return the same value twice', function () {
    var uid1 = uid();
    var uid2 = uid();
    
    // Good enough. This isn't exactly rocket science.
    assert.ok(uid1 != uid2);
  });

  it('is unlikely to collide with other keys', function () {
    var uid1 = uid();

    // Good enough. Random and longish.
    assert.ok(uid1.length > 5);
  });
});

describe('getFunctionKeys', function () {
  it('is a function', isA(getFunctionKeys, 'function'));

  var mixedHash = {
    'identity': function (thing) {
      return thing;
    },
    'state1': true,
    'state2': false,
    'allowedStates': [ 'state1', 'state2' ]
  };

  it('returns an array keys that map to functions on the passed object', function () {
    var fnKeys = getFunctionKeys(mixedHash);

    fnKeys.forEach(function(key) {
      assertType(mixedHash[key], 'function');
    });
  });
});

describe('createMethodsHash', function () {
  it('is a function', isA(createMethodsHash, 'function'));

  var mixedHash = {
    'identity': function (thing) {
      return thing;
    },
    'state1': true,
    'state2': false,
    'allowedStates': [ 'state1', 'state2' ]
  };

  it('returns an object that contains lifted versions of the functions in the passed object, at the same keys', function () {
    var methodsHash = createMethodsHash(mixedHash);

  });

  it('returns a new object (does not mutate the original)', function () {
    var methodsHash = createMethodsHash(mixedHash);
    assert.notEqual(methodsHash, mixedHash);
  });
});

describe('chain', function () {
  it('is a function', isA(chain, 'function'));
  it('returns a function', isA(chain({}), 'function'));
});

describe('constructor returned by chain', function () {
  var $ = chain({
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

  it("updates it's state with the return value of the original unlifted function", function () {
    assert.equal(unbox($(10).x(10).x(10)), 1000);
    assert.equal(unbox($(10).x(3).mod(3)), 0);
  });
});
