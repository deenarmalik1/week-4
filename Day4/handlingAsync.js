// ===== Full picture: Call Stack + Web APIs + Queues + Event Loop for us =====

console.log("we sync 1 - goes directly to Call Stack");

// ===== Web APIs - we offload =====
setTimeout(() => {
  console.log("we setTimeout callback - was handled by Web API timer, now in Macrotask Queue");
}, 1000); // we hand to Web API: Timer thread starts 1000ms

fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then(() => console.log("we fetch then - network handled by Web API, callback in Microtask Queue"));
// we hand to Web API: browser network thread starts request

let btn = document.querySelector("button");
btn.addEventListener("click", () => {
  console.log("we click handler - DOM event handled by Web API, on click goes to Macrotask Queue");
});
// we hand event listening to Web API

console.log("we sync 2 - Call Stack still running");

// ===== Queues priority - what we must see =====
console.log("we sync start - Call Stack");

setTimeout(() => console.log("we macrotask 1 - Callback Queue"), 0);

Promise.resolve().then(() => {
  console.log("we microtask 1 - Microtask Queue");
});

queueMicrotask(() => {
  console.log("we microtask 2 - Microtask Queue via queueMicrotask");
});

Promise.resolve().then(() => {
  console.log("we microtask 3 - Microtask Queue");
  // we can add more microtasks inside microtask - event loop will still drain all before macro
  queueMicrotask(() => console.log("we microtask 4 - nested, still before macrotask"));
});

setTimeout(() => console.log("we macrotask 2 - Callback Queue"), 0);

console.log("we sync end - Call Stack empty now");

// Order we get:
// we sync start
// we sync end
// we microtask 1
// we microtask 2
// we microtask 3
// we microtask 4
// we macrotask 1
// we macrotask 2

// Event Loop does:
// while(true) {
//   if (CallStack empty) {
//     drain all Microtask Queue -> push to Call Stack
//     take one Macrotask Queue -> push to Call Stack
//   }
// }

// ===== Call Stack LIFO - we push pop =====
function first() {
  console.log("we in first - pushed to Call Stack");
  second();
  console.log("we back in first - second popped");
}
function second() {
  console.log("we in second - pushed on top of first");
  third();
  console.log("we back in second");
}
function third() {
  console.log("we in third - top of stack");
}
first();
// Stack: first -> second -> third (top) -> pop third -> pop second -> pop first

// Blocking we experience
function blocking() {
  console.log("we start blocking - Call Stack busy");
  let start = Date.now();
  while (Date.now() - start < 2000) {} // we block 2s, Event Loop can't run queues
  console.log("we end blocking - Call Stack free now, Event Loop can check queues");
}

// ===== Web APIs different types we use =====
// Timer API
let tId = setTimeout(() => console.log("we timer API done"), 100);
clearTimeout(tId);

// DOM API
let div = document.querySelector("div");
div.addEventListener("click", () => console.log("we DOM API event"));

// Fetch API
fetch("/api/data");

// Storage, Geolocation, etc are also Web APIs
navigator.geolocation.getCurrentPosition(pos => console.log("we got pos", pos));

// ===== Microtask vs Macrotask creation =====
// Microtask creation
let p = new Promise((resolve) => {
  console.log("we executor - sync in Call Stack");
  resolve("we resolve");
});
p.then(() => console.log("we then - Microtask"));

let observer = new MutationObserver(() => console.log("we MutationObserver - Microtask"));
observer.observe(document.body, { childList: true });
document.body.appendChild(document.createElement("span")); // triggers microtask

// Macrotask creation
setTimeout(() => console.log("we setTimeout - Macrotask"), 0);
setInterval(() => console.log("we setInterval - Macrotask"), 1000);
btn.addEventListener("click", () => console.log("we click - Macrotask"));

// requestAnimationFrame - special queue before repaint
requestAnimationFrame(() => console.log("we rAF - runs before next repaint"));

// ===== Full trace together for us =====
console.log("we 1 - sync Call Stack");

setTimeout(() => {
  console.log("we 5 - macrotask from Web API timer");
  Promise.resolve().then(() => console.log("we 6 - microtask inside macrotask, runs right after we 5"));
}, 0);

Promise.resolve().then(() => {
  console.log("we 3 - microtask from promise");
  setTimeout(() => console.log("we 7 - macrotask added inside microtask"), 0);
});

console.log("we 2 - sync Call Stack");
queueMicrotask(() => console.log("we 4 - microtask from queueMicrotask"));

console.log("we sync done - Event Loop will start draining");
// Final order we see: 1,2, sync done, 3,4, 5,6, 7