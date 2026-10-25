// Example code explaining hoisting :-

// var hoisting
console.log(x); // undefined
var x = 10;
console.log(x); // 10

// let and const hoisting - Temporal Dead Zone
console.log(y); // ReferenceError
let y = 20;

console.log(z); // ReferenceError
const z = 30;

// Function Declaration hoisting - fully hoisted
sayHi(); // Works: "Hi"
function sayHi() {
  console.log("Hi");
}

// Function Expression hoisting with var
sayHello(); // TypeError: sayHello is not a function
var sayHello = function() {
  console.log("Hello");
};

// Arrow Function with let
sayBye(); // ReferenceError
let sayBye = () => {
  console.log("Bye");
};