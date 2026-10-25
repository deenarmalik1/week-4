// ===== 1. Console APIs we use for quick debug =====

let user = { name: "we user", age: 25, posts: [{ id: 1 }, { id: 2 }] };
console.log("we basic", user);
console.table(user); // we table view for object
console.table([{ a: 1, b: 2 }, { a: 3, b: 4 }]);
console.dir(user); // we detailed properties
console.log("%c we styled log", "color: blue; font-size: 20px;");

console.group("we user details");
console.log("we name", user.name);
console.log("we age", user.age);
console.groupEnd();

console.time("we loop time");
for (let i = 0; i < 1000000; i++) {}
console.timeEnd("we loop time");

console.trace("we where called from"); // we stack without throwing

let isLoggedIn = false;
console.assert(isLoggedIn, "we should be logged in but false"); // we logs only if false

console.warn("we warning example");
console.error("we error example with stack");

let x = 10, y = 20;
console.log({ x, y }); // we shorthand object log
console.log("we x:", x, "y:", y);

// ===== 2. debugger statement + breakpoint types =====

function calc(a, b) {
  let sum = a + b;
  debugger; // we pause here if DevTools open
  let mul = a * b;
  return sum + mul;
}
calc(5, 10);

// Conditional breakpoint we set in DevTools UI:
// Right click line number -> Add conditional breakpoint -> Expression: i === 50
for (let i = 0; i < 100; i++) {
  console.log(i); // we want pause only when i=50, use conditional breakpoint
}

// Logpoint we set in DevTools UI:
// Right click -> Add logpoint -> Log: "we i is", i
// Advantage: we log without code change
for (let i = 0; i < 10; i++) {
  // logpoint injects here
}

// XHR breakpoint: DevTools -> Sources -> XHR Breakpoints -> Add -> "/api/user"
// Event listener breakpoint: Sources -> Event Listener Breakpoints -> Mouse -> click
// Exception breakpoint: Sources -> Pause on exceptions -> check pause on caught/uncatched

// ===== 3. Paused inspection - what we see when paused =====

function outer() {
  let outerVar = "we outer";
  function inner(innerParam) {
    let localVar = "we local";
    debugger; // when paused here we can inspect:
    // Scope: localVar, innerParam, outerVar (closure), global
    // Watch: add expression outerVar + innerParam
    // Call Stack: inner -> outer -> anonymous
    // Hover: hover over localVar to see value
    console.log(localVar, outerVar, innerParam);
  }
  inner("we param");
}
outer();

// Step controls we use in DevTools:
// Step Over (F10): run next line, don't enter function
// Step Into (F11): go inside function call
// Step Out (Shift+F11): run till current function returns
// Resume (F8): continue to next breakpoint

// ===== 4. Network + performance debug code we use =====

// Network tab we inspect these
fetch("/api/user")
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error("we fetch error", err));

async function getUserWithDebug() {
  console.time("we fetch user");
  let res = await fetch("/api/user");
  console.log("we status", res.status, res.headers.get("content-type"));
  let data = await res.json();
  console.timeEnd("we fetch user");
  return data;
}

// Performance.mark we for performance tab
performance.mark("we start");
for (let i = 0; i < 100000; i++) {}
performance.mark("we end");
performance.measure("we loop measure", "we start", "we end");
console.log(performance.getEntriesByType("measure"));

// Memory leak example we find in Memory tab
let leaked = [];
function addLeak() {
  leaked.push(new Array(100000).fill("we leak")); // we grows never freed
}
// Heap snapshot shows leaked array retained

// ===== 5. Async debugging we =====

async function asyncDebug() {
  let p1 = Promise.resolve("we p1");
  debugger; // pause before await
  let val = await p1; // we can inspect val after step over await
  console.log(val);
  let p2 = Promise.reject("we p2 fail");
  try {
    await p2;
  } catch (e) {
    debugger; // we inspect rejection in catch
    console.log("we caught", e);
  }
}
asyncDebug();

// Async stack trace - enable in DevTools: Debugger -> Async checkbox
function first() { second(); }
function second() { third(); }
function third() { 
  setTimeout(() => {
    console.trace("we async trace shows first->second->third->setTimeout");
  }, 100);
}
first();

// ===== 6. Node.js debugging we =====

// Run: node --inspect file.js -> open chrome://inspect -> click inspect
// Run: node --inspect-brk file.js -> pauses at first line
function nodeDebug() {
  let a = 5;
  debugger; // we works in Node inspector too
  console.log(a);
}
nodeDebug();

// VS Code launch.json we use
// {
//   "version": "0.2.0",
//   "configurations": [
//     { "type": "node", "request": "launch", "name": "we debug node", "program": "${workspaceFolder}/app.js" },
//     { "type": "chrome", "request": "launch", "name": "we debug chrome", "url": "http://localhost:3000" }
//   ]
// }

// Tracing flags: node --trace-warnings --trace-uncaught app.js

// ===== 7. Production debug helpers we =====

// Source maps: bundler generates app.js.map so minified -> original in DevTools
// //# sourceMappingURL=app.js.map

// Global handlers we add
window.addEventListener("error", (e) => {
  console.log("we global error caught", e.message, e.filename, e.lineno);
});
window.addEventListener("unhandledrejection", (e) => {
  console.log("we unhandled promise", e.reason);
  e.preventDefault();
});

// Debug utility we keep
function debugOnly(fn) {
  if (process.env.NODE_ENV !== "production") {
    fn();
  }
}
debugOnly(() => console.log("we only in dev"));

// Blackbox script: DevTools -> Settings -> Ignore list -> add jquery.min.js, we skip stepping into library

// Snippets: DevTools -> Sources -> Snippets -> New snippet we save
// Overrides: Sources -> Overrides -> Select folder -> map remote file to local for editing