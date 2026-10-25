// ===== SYNCHRONOUS - blocking, line by line, we wait =====
console.log("we start 1");
console.log("we start 2");
console.log("we start 3");
// Output order is exactly as we wrote: 1,2,3

function taskA() {
  console.log("we are in taskA");
}
function taskB() {
  console.log("we are in taskB start");
  taskA(); // we must finish taskA before we continue taskB
  console.log("we are in taskB end");
}
taskB();

// Heavy blocking example - we freeze
console.log("we start loop");
for (let i = 0; i < 1e9; i++) {} // our main thread is busy here
console.log("we end loop - we were blocked till loop finished");

// ===== ASYNCHRONOUS - non-blocking, we continue =====
console.log("we start");

setTimeout(() => {
  console.log("we are setTimeout - we run after 0ms but after sync code");
}, 0);

console.log("we end");
// Output: we start -> we end -> we are setTimeout (we didn't block)

// How event loop works for us
console.log("we 1 - call stack");
setTimeout(() => console.log("we 4 - macrotask queue"), 0);
Promise.resolve().then(() => console.log("we 3 - microtask queue"));
console.log("we 2 - call stack");
// Order: we 1, we 2, we 3 (micro first), we 4 (macro next)

// ===== CALLBACKS - old way we handled async =====
function fetchDataCallback(callback) {
  setTimeout(() => {
    callback("we got data");
  }, 1000);
}
fetchDataCallback((data) => {
  console.log(data); // we handle when data arrives
});

// Callback hell we faced
setTimeout(() => {
  console.log("we step 1");
  setTimeout(() => {
    console.log("we step 2");
    setTimeout(() => {
      console.log("we step 3 - nested hell");
    }, 500);
  }, 500);
}, 500);

// ===== PROMISES - better way for us =====
let promise = new Promise((resolve, reject) => {
  // pending
  setTimeout(() => resolve("we success"), 1000);
  // setTimeout(() => reject("we failed"), 1000);
});

promise
  .then((res) => console.log(res))
  .catch((err) => console.log(err))
  .finally(() => console.log("we always run"));

console.log("we are not blocked, we continue while promise pending");

// Chaining - we flatten hell
fetch("https://api.example.com/user")
  .then(res => res.json())
  .then(user => fetch(`https://api.example.com/posts/${user.id}`))
  .then(res => res.json())
  .then(posts => console.log("we got posts", posts))
  .catch(err => console.log("we handle error", err));

// Promise states we see
let p1 = Promise.resolve("we immediate resolve"); // fulfilled
let p2 = Promise.reject("we immediate reject"); // rejected
p2.catch(e => console.log(e));

// ===== ASYNC/AWAIT - how we write async like sync =====
async function getData() {
  console.log("we start async function");
  try {
    let response = await fetch("https://api.example.com/data"); // we pause THIS function only, not thread
    let data = await response.json(); // we wait again
    console.log("we got", data);
    return data;
  } catch (err) {
    console.log("we caught error", err);
  }
}
getData();
console.log("we continue outside, not blocked by await inside function");

// Sequential vs Parallel - important for us
async function sequential() {
  let a = await fetch("/api/a"); // we wait for a
  let b = await fetch("/api/b"); // then we start b -> slow
}

async function parallel() {
  let promiseA = fetch("/api/a"); // we start both together
  let promiseB = fetch("/api/b");
  let [a, b] = await Promise.all([promiseA, promiseB]); // we wait for both
  console.log("we faster in parallel");
}

// Microtask vs Macrotask priority - we must remember
console.log("we sync 1");
setTimeout(() => console.log("we macrotask 1 - setTimeout"), 0);
Promise.resolve().then(() => console.log("we microtask 1 - promise"));
Promise.resolve().then(() => console.log("we microtask 2 - promise"));
queueMicrotask(() => console.log("we microtask 3 - queueMicrotask"));
setTimeout(() => console.log("we macrotask 2 - setTimeout"), 0);
console.log("we sync 2");
// Order we get: sync 1, sync 2, micro 1, micro 2, micro 3, macro 1, macro 2

// Event loop visual for us
// Call Stack: [sync code] -> empty -> check Microtask Queue -> empty -> check Macrotask Queue -> repeat