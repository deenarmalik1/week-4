// Example code explaining the single thread of javascript:-

console.log("1 - Start");

setTimeout(() => {
  console.log("2 - setTimeout callback - runs later");
}, 0);

console.log("3 - End");

// Output Order: 1, 3, 2
// Why? JS is single-threaded. Even with 0ms delay,
// setTimeout is handled by Web API, its callback goes to Queue,
// and executes only when Call Stack is empty.

// Blocking example showing single thread
console.log("Start");

function longTask() {
  let start = Date.now();
  while (Date.now() - start < 3000) {} // Blocks for 3 seconds
  console.log("Long task done - main thread was blocked");
}

setTimeout(() => {
  console.log("Timer callback - waited for longTask to finish");
}, 100);

longTask();