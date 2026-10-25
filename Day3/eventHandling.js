// ===== 1. addEventListener =====
let btn = document.querySelector("button");

// Syntax: target.addEventListener(type, handler, options)
btn.addEventListener("click", function(event) {
  console.log("button clicked");
  console.log(event); // Event object
});

btn.addEventListener("click", () => {
  console.log("second handler for same click");
}); // multiple listeners allowed

// vs old onclick - only one
// btn.onclick = () => console.log("first");
// btn.onclick = () => console.log("second - overwrites first");

let input = document.querySelector("input");
input.addEventListener("keydown", (e) => {
  console.log(e.key); // which key pressed
});

window.addEventListener("load", () => console.log("page loaded"));
document.addEventListener("DOMContentLoaded", () => console.log("DOM ready"));

let form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop page reload
  console.log("form submitted");
});

// Options
btn.addEventListener("click", () => {
  console.log("fires only once");
}, { once: true }); // auto-removes after 1st call

window.addEventListener("scroll", () => {
  console.log("scrolling");
}, { passive: true }); // we won't call preventDefault, better performance

// Capture phase vs bubble phase
// bubble (default): child -> parent
// capture: parent -> child
document.body.addEventListener("click", () => {
  console.log("body capture");
}, { capture: true });

document.body.addEventListener("click", () => {
  console.log("body bubble");
}, { capture: false }); // default

// ===== 2. removeEventListener =====

// MUST have same function reference
function handleClick() {
  console.log("clicked, now removing");
  btn.removeEventListener("click", handleClick); // removes itself
}
btn.addEventListener("click", handleClick);

// This FAILS - different references
btn.addEventListener("click", () => console.log("hi"));
btn.removeEventListener("click", () => console.log("hi")); // not removed, different function

// Correct way with anonymous -> store reference
let handler = () => console.log("hi");
btn.addEventListener("click", handler);
btn.removeEventListener("click", handler); // works

// capture must match on removal
function onClickCapture() { console.log("capture"); }
document.addEventListener("click", onClickCapture, { capture: true });
document.removeEventListener("click", onClickCapture, { capture: true }); // must pass same capture:true

// once auto-removes, no need to call remove

// ===== 3. event.target vs event.currentTarget =====

// HTML: <button id="btn"><span id="icon">⭐ Icon</span> Click</button>
let button = document.getElementById("btn");

button.addEventListener("click", function(e) {
  console.log(e.target); // what was ACTUALLY clicked - e.g., <span id="icon">
  console.log(e.currentTarget); // where listener is attached - <button id="btn">
  console.log(e.currentTarget === this); // true in normal function
  console.log(e.target === e.currentTarget); // false if clicked on inner span, true if clicked on button padding
});

// Arrow function: this is NOT currentTarget
button.addEventListener("click", (e) => {
  console.log(e.currentTarget); // button
  // console.log(this === e.currentTarget) // false - this is window/lexical
});

// Event Delegation - target shines here
// HTML: <ul id="list"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
let list = document.getElementById("list");
list.addEventListener("click", (e) => {
  console.log(e.target); // li that was clicked
  console.log(e.currentTarget); // ul#list - where handler lives
  if (e.target.tagName === "LI") {
    console.log("clicked on", e.target.textContent);
    e.target.classList.toggle("active");
  }
});

// Bubbling demo - target stays same, currentTarget changes
// HTML: <div id="parent"><button id="child">Click</button></div>
let parent = document.getElementById("parent");
let child = document.getElementById("child");

parent.addEventListener("click", (e) => {
  console.log("parent handler");
  console.log("target:", e.target.id); // child - origin never changes
  console.log("currentTarget:", e.currentTarget.id); // parent - where we are now
});

child.addEventListener("click", (e) => {
  console.log("child handler");
  console.log("target:", e.target.id); // child
  console.log("currentTarget:", e.currentTarget.id); // child - same here
});

// stopPropagation
child.addEventListener("click", (e) => {
  e.stopPropagation(); // stops bubbling, parent won't get event
  console.log("child - bubbling stopped");
});

child.addEventListener("click", (e) => {
  e.stopImmediatePropagation(); // stops other listeners on same element + bubbling
});

child.addEventListener("click", (e) => {
  e.preventDefault(); // e.g., prevent link navigation, form submit, checkbox toggle
  console.log(e.defaultPrevented); // true
});

// Same element, same event, multiple listeners execution order
child.addEventListener("click", () => console.log("listener 1"));
child.addEventListener("click", () => console.log("listener 2"));