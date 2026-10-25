// Example code explaining IIFE :-

// Basic IIFE
(function() {
  console.log("IIFE executed immediately");
})();

// IIFE with arrow function
(() => {
  console.log("Arrow IIFE");
})();

// IIFE with parameters
(function(name) {
  console.log("Hello " + name);
})("JS");

// IIFE for private scope / avoiding global pollution
(function() {
  var privateVar = "I am private";
  console.log(privateVar); // Accessible here
})();
// console.log(privateVar); // ReferenceError - not accessible outside

// IIFE returning a value / Module pattern
const counter = (function() {
  let count = 0; // private
  return {
    increment: function() { count++; return count; },
    decrement: function() { count--; return count; },
    getCount: function() { return count; }
  };
})();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2

// IIFE for one-time initialization
const config = (function() {
  let env = "production";
  let apiUrl = env === "production" ? "https://api.prod.com" : "https://api.dev.com";
  return { env, apiUrl };
})();