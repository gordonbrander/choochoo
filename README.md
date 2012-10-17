ChooChoo
--------

Create small and lazy DSLs using method chaining syntax.

                      .---._
                  .--(. '  .).--.      . .-.
               . ( ' _) .)` (   .)-. ( ) '-'
              ( ,  ).        `(' . _)
            (')  _________      '-'
            ____[_________]                            ________
            \__/ | _ \  ||    ,;,;,,                  [________]
            _][__|(")/__||  ,;;;;;;;;,   __________   _| LLLL |_
           /             | |          | |____      | |     \|   |
          (| .--.    .--.| |   ----   | |     ___  | |   |\     |
          /|/ .. \~~/ .. \_|_.-.__.-._|_|_.-.__.-._|_|_.-:_\.-._|
     ==+=/_|\ '' /~~\ '' /=+( o )( o )+==( o )( o )=+=( o )( o )+=
     '=='=='='--'==+='--'===+'-'=='-'==+=='-'+='-'===+='-'=='-'==+

ChooChoo creates "trains" of methods from objects full of lambda
functions, allowing you to compose the functions using method chaining.
Think of it as **jQuery coding style for everything else**.

What is a lambda function? Any function that does not refers to `this`
pseudo-variable. Ideally lambdas are side-effect free. They take input
and compute output without changing / mutating anything that is not
created with in them.

Show me
-------

```js
// Define our lambda functions

function descriptor(source) {
  return Object.getOwnPropertyNames(source).reduce(function(result, name) {
    result[name] = Object.getOwnPropertyDescriptor(source, name)
    return result
  }, {})
}

function merge() {
  var sources = Array.prototype.slice.call(arguments)
  var target = sources.shift()
  var whitelist = {}
  sources.forEach(function(source) {
    var properties = descriptor(source)
    Object.keys(properties).forEach(function(name) {
      whitelist[name] = properties[name]
    })
  })
  return Object.defineProperties(target, whitelist)
}

function pick() {
  var names = Array.prototype.slice.call(arguments)
  var source = names.shift()
  var properties = descriptor(source)
  var whitelist = {}
  names.forEach(function(name) {
    whitelist[name] = properties[name]
  })
  return Object.create(Object.getPrototypeOf(source), whitelist)
}

var dsl = require("choochoo")
var hash = dsl({ descriptor: descriptor, pick: pick, merge: merge })

hash({ a: 1, b: 2, c: 3, d: 4 }).
  merge({ x: 12, y: 13 }).
  pick('a', 'b', 'x').
  value() // => { x: 12, a: 1, b: 2 }
```

But hey, DOM is full of side effects and pure functions can't really work, so
feel free to take impure functions onboard:

Show me
-------

```js
var dom = dsl({
  width: function (element, width) {
    element.width = width;
    return element;
  },
  height: function (element, height) {
    element.height = height;
    return element;
  }
});

var myEl = document.getElementById('my-el');
DOMTrain(myEl).width(100).height(100);

// You can create trains directly from modules, too!
var MTrain = choochoo.train(require('mymodule'));
MTrain('source').convert().transform();
```
