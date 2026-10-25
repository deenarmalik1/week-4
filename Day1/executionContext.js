// The example code explaining execution context:-

// 1. Global Execution Context Created

var a = 10; // Memory Phase: a = undefined -> Execution Phase: a = 10

function outer() { // Memory Phase: outer = function stored
  var b = 20;      // New Function Execution Context for outer()
                   // Memory Phase inside outer: b = undefined
                   // Execution Phase inside outer: b = 20

  function inner() { // Memory Phase inside outer: inner = function stored
    var c = 30;      // New Function Execution Context for inner()
                     // Memory: c = undefined
                     // Execution: c = 30
    console.log(a + b + c); // 60 - finds a via scope chain
  }

  inner(); // Call inner() -> Push inner() to Call Stack
           // After inner() finishes -> Pop from Stack
}

outer(); // Call outer() -> Push outer() to Call Stack

// Call Stack Order:
// 1. Global (bottom)
// 2. outer()
// 3. inner() (top) -> executes -> popped
// 4. outer() finishes -> popped
// 5. Only Global remains