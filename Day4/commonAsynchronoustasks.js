// ===== 1. setTimeout - we delay =====
console.log("we start");
setTimeout(() => {
  console.log("we run after 1000ms minimum");
}, 1000);
console.log("we don't wait, we continue");

// setTimeout with args we pass
setTimeout((name) => {
  console.log(`we hello ${name}`);
}, 500, "team");

// clearTimeout - we cancel
let timerId = setTimeout(() => console.log("we will NOT run"), 1000);
clearTimeout(timerId);

// setInterval - we repeat
let count = 0;
let intervalId = setInterval(() => {
  count++;
  console.log(`we count ${count}`);
  if (count === 3) {
    clearInterval(intervalId); // we stop
    console.log("we stopped interval");
  }
}, 500);

// setTimeout 0 still async - we go to queue
console.log("we sync 1");
setTimeout(() => console.log("we timeout 0 - but still async"), 0);
console.log("we sync 2");

// ===== 2. API Calls / fetch - our main async =====
// fetch returns Promise
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then(res => res.json())
  .then(data => console.log("we got data", data))
  .catch(err => console.log("we error", err));

console.log("we continue while fetch in background");

// async/await version we use
async function getPost() {
  try {
    let res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    let data = await res.json();
    console.log("we got with await", data);
  } catch (err) {
    console.log("we caught", err);
  }
}
getPost();

// Multiple API calls - sequential vs parallel for us
async function sequentialCalls() {
  let user = await fetch("/api/user").then(r => r.json());
  let posts = await fetch(`/api/posts/${user.id}`).then(r => r.json()); // we wait for user first
}

async function parallelCalls() {
  let p1 = fetch("/api/user");
  let p2 = fetch("/api/posts");
  let [userRes, postsRes] = await Promise.all([p1, p2]); // we start both together
}

// axios version we use
// axios.get("/api/data").then(res => console.log(res.data));

// XMLHttpRequest - old way we did
let xhr = new XMLHttpRequest();
xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
xhr.onload = () => console.log("we XHR got", xhr.response);
xhr.send();

// ===== 3. Promises, queueMicrotask =====
Promise.resolve().then(() => console.log("we microtask from promise"));

queueMicrotask(() => console.log("we microtask from queueMicrotask"));

// Promise.all, race, allSettled we use
Promise.all([
  fetch("/api/a"),
  fetch("/api/b")
]).then(() => console.log("we all done"));

Promise.race([
  fetch("/api/fast"),
  fetch("/api/slow")
]).then(() => console.log("we first one wins"));

// ===== 4. DOM Events - async wait for user =====
let btn = document.querySelector("button");
btn.addEventListener("click", () => {
  console.log("we clicked - event callback async");
});

// Image loading async
let img = new Image();
img.onload = () => console.log("we image loaded");
img.onerror = () => console.log("we image failed");
img.src = "https://example.com/image.jpg";

// ===== 5. requestAnimationFrame - we animate =====
let box = document.querySelector("#box");
function animate() {
  box.style.left = parseInt(box.style.left || 0) + 1 + "px";
  requestAnimationFrame(animate); // we ask before next repaint
}
requestAnimationFrame(animate);

// ===== 6. MutationObserver - microtask =====
let observer = new MutationObserver(() => console.log("we DOM mutated - microtask"));
observer.observe(document.body, { childList: true });

// ===== 7. Priority demo - what we must remember =====
console.log("we sync start");

setTimeout(() => console.log("we macrotask - setTimeout"), 0);

Promise.resolve().then(() => console.log("we microtask - promise"));

queueMicrotask(() => console.log("we microtask - queueMicrotask"));

fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then(() => console.log("we microtask - fetch then (promise)"));

btn.addEventListener("click", () => console.log("we macrotask - click event"));

console.log("we sync end");

// Order we see: sync start, sync end, micro promise, micro queueMicrotask, micro fetch then, macrotask setTimeout, macrotask click (when we click)

// ===== 8. Web Worker - heavy task we offload =====
// main.js we have
// let worker = new Worker("worker.js");
// worker.postMessage("we start heavy");
// worker.onmessage = (e) => console.log("we got from worker", e.data);

// worker.js
// self.onmessage = () => {
//   // heavy loop
//   self.postMessage("we done");
// };