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
