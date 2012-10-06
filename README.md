ChooChoo
--------

Compose functions using method chaining syntax.

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

What is a lambda function? Anthing function that's not a method. Lambdas are
functions without side effects. They take value and return a result, without
referencing `this`.

Show me
-------

    var DOMTrain = choochoo.train({
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

Ideas
--------

Deferred evaluation. Use ChooChoo as a DSL for creating composed functions,
instead of evaluations.

This might require a bit of a restructuring of the internals. I'm thinking:

* Make the Box an array that keeps track of the list of evaluations to
  be performed.
* Box is an array of arrays. Each sub-array contains a function and
  additional arguments.
* Methods created from functions will push evaluation lists instead of
  invoking the original function.
* The returned function will cycle through the list of evaluations,
  invoking them with the passed value + arguments passed to methods.
* The return value of the evaluated function is automatically unboxed.

Is this a common enough use case? It's true that evaluated chains of methods
are not composable, but this is supposed to be a DSL -- a thin veneer over
composable functions.

Do we need to be able to compose compositions? Maybe.
