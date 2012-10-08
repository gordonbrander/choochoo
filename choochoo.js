// How to:
// 
//     var $ = daisychain(require('foo'));
//     
//     $(value)
//       .foo()
//       .bar(12)
//       .baz();

// Alias `Object.create`. We'll want to use it more than once.
var create = Object.create;

// Just passes a value through.
// We'll use this as a fallback function for construct.
function identity(thing) {
  return thing;
}

// We'll also have to convert arguments into real arrays, so let's
// wrap slice conveniently.
function toArray(arraylike) {
  return Array.prototype.slice.call(arraylike);
}

// Create a unique client ID. Useful as a stopgap while `Symbol`
// is being standardized.
function uid() {
  return Math.random().toString(36).substr(2, 9);
}
exports.uid = uid;

// Create a unique key 
var __value__ = uid();

// Box a given value with an object.
function box(object, value) {
  object[__value__] = value;
  return object;
}
exports.box = box;

// Unbox a value from an object.
// Returns the value, or `undefined` if no value has been boxed.
function unbox(object) {
  return object[__value__];
}
exports.unbox = unbox;

// "Lift" a function into a daisychain method. Creates a new function by
// wrapping the original function. The resulting function will expect a
// daisychain object as its `this` context, and will return the result
// boxed in a `daisychain` object. This means the value returned will always
// be chainable.
function lift(fn) {
  return function lifted() {
    // Convert the arguments object into an array.
    var args = toArray(arguments);
    // Unbox the previous value.
    var prevValue = unbox(this);
    // Pass the previous value, along with the rest of the arguments to
    // the original function.
    var nextValue = fn.apply(null, [prevValue].concat(args));
    // Box the return value.
    return box(this, nextValue);
  }
}
exports.lift = lift;

// Before we can convert functions into methods, we'll need to be able
// to identify all the functions in a given hash. To help out with that,
// let's create a method that returns all keys for a given hash that map
// to functions.
// 
// Get all keys in the hash that map to functions.
// Returns an array of keys.
function getFunctionKeys(hash) {
  // Get all iterable own keys of `hash`.
  var keys = Object.keys(hash);

  // Filter down to keys which point to functions.
  return keys.filter(function (key) {
    return typeof(hash[key]) === 'function';
  });
}
exports.getFunctionKeys = getFunctionKeys;

// Create a hash of daisychain method from a hash of lamda functions.
// 
// What is a lambda function? It's a stateless function that doesn't use `this`.
// Arguments go in, result come out. Functions will be
// wrapped in methods, and the original function will be passed the expected
// arguments 
// 
// Returns a hash of methods.
function createMethodsHash(hash) {
  // Create a new hash of transformed functions. Stateless functions become
  // methods of `hash`.
  return getFunctionKeys(hash).reduce(function(memo, key) {
    memo[key] = lift(hash[key]);
    return memo;
  }, {});
}
exports.createMethodsHash = createMethodsHash;

// Create a new daisychain constructor from a hash of stateless functions.
// Returns a factory function.
function chain(hash, construct) {
  // Create a hash of methods from the stateless functions. This will be
  // the prototype for our daisychains.
  var methods = createMethodsHash(hash);

  // Return the factory function that will be used to create new chains.
  // 
  // Example:
  // 
  //     $train(value).foo().bar().baz();
  return function $train(value) {
    var instance = create(methods);
    value = (construct || identity)(value);
    return box(instance, value);
  }
}
exports.chain = chain;
