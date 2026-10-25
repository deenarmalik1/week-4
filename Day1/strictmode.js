// Example code explaining strict mode :-

// 1. How to enable
"use strict"; // For whole script

function myFunc() {
  "use strict"; // For only this function
}

// 2. Differences in behaviour

// a) No undeclared variables
// x = 10; // ReferenceError

// b) No deletion of non-deletable
// var y = 10;
// delete y; // TypeError

// c) No duplicate parameters
// function sum(a, a) {} // SyntaxError

// d) 'this' is undefined, not window
function checkThis() {
  console.log(this); // undefined in strict, window in non-strict
}
checkThis();

// e) No octal literals
// let num = 010; // SyntaxError

// f) No 'with' statement
// with (Math) {} // SyntaxError

// g) eval scope is separate
eval("var z = 20;");
console.log(typeof z); // undefined in strict, 20 in non-strict

// h) Read-only property write throws
const obj = {};
Object.defineProperty(obj, 'a', { value: 10, writable: false });
// obj.a = 20; // TypeError

// i) Reserved keywords not allowed
// let implements = 5; // SyntaxError