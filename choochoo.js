/*jshint asi:true globalstrict: true node: true */

"use strict";

// How to:
//
//     var $ = daisychain(require('foo'));
//
//     $(value)
//       .foo()
//       .bar(12)
//       .baz()
//       .value()

// The most optimal way to slice arguments to array is by
// calling `slicer.call` that's we reference to it.
var slicer = Array.prototype.slice


// This is unique name that is used to store tasks that composed value
// will have to perform.
var TASKS = 'tasks-queue@' + module.id


function lift(fn) {
  /**
  "Lift" a function into a daisychain method. Creates a new function by
  wrapping the original function. The resulting function will expect a
  daisychain object as its `this` context, and will return the result
  representing a transformation of `this` by applying `fn` on it, although
  note that `fn` won't be called at this point, instead it will be deferred
  until `.value()` is called.
  **/
  return function lifted() {
    // Create instance of `this` type with `f` and `arguments` stored
    // into it's task queue.
    return new this.constructor(this[TASKS].concat([fn, arguments]))
  }
}


// Chains produced by this library are lazy, no computation is done during
// chaining. Each method call just results an instances of it's dsl containing
// task queue, which is sort of receipt, executing it will result in a value
// represent by a returned instance.
var execute = function execute() {
  /**
  Method executes all the tasks in the queue to computes a value represent by
  a given instance. Computed value is returned back.
  **/

  var tasks = this[TASKS]       // property contains all the queued tasks
  var count = tasks.length
  var index = 0
  var result = tasks[index++]   // First item in a queue is initial data

  // Perform data transformations and accumulate `result` until
  // task queue is exhausted.
  while (index < count) {
    // Odd elements are functions
    var fn = tasks[index++]
    // Even elements are arguments
    var params = slicer.call(tasks[index++])
    // Set first argument to accumulated result
    params.unshift(result)
    // Accumulate new result
    result = fn.apply(fn, params)
  }

  // Once all the transformations are made return accumulated value.
  return result
}

function dsl(hash) {

  // Creates a new daisychain constructor from a hash of stateless functions.
  // Returns a factory function.
  function Train(input) {
    // Factory function that will be used to create new chains.
    //
    // Example:
    //
    // Train(value).foo().bar().baz().value()

    // If train is called with `new` keyword than it's assumed
    // to be passed all the
    if (this instanceof Train) this[TASKS] = input
    else return new Train([input])
  }
  Train.prototype.value = execute
  Train.prototype.valueOf = execute

  // Convert all the stateless functions from hash into methods and store them
  // under prototype for our daisychains.
  for (var key in hash) {
    // Filter down to keys which point to functions. Ignore `constructor`
    // as it's reserved for internal use.
    var fn = hash[key]
    if (typeof(fn) === "function" && key !== "constructor")
      Train.prototype[key] = lift(hash[key])
  }

  return Train
}

// Expose key in order to ease debugging.
dsl.TASKS = TASKS
// Expose helper `lift` function.
dsl.lift = lift

module.exports = dsl
