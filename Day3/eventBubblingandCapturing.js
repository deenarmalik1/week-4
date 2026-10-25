// ===== PHASES: CAPTURE -> TARGET -> BUBBLE =====

// HTML we have: <body><section id="section"><div id="div"><button id="btn">Click</button></div></section></body>

let btn = document.getElementById("btn");
let div = document.getElementById("div");
let section = document.getElementById("section");
let body = document.body;

// CAPTURING PHASE - top down, we use {capture:true}
body.addEventListener("click", (e) => {
  console.log("body capture - we are going down");
}, { capture: true });

section.addEventListener("click", (e) => {
  console.log("section capture - still going down");
}, { capture: true });

div.addEventListener("click", (e) => {
  console.log("div capture - almost at target");
}, { capture: true });

// TARGET PHASE - we reached target
btn.addEventListener("click", (e) => {
  console.log("btn TARGET - we are at target, event.target =", e.target.id);
});

// BUBBLING PHASE - bottom up, default {capture:false}
div.addEventListener("click", (e) => {
  console.log("div bubble - we are bubbling up");
});

section.addEventListener("click", (e) => {
  console.log("section bubble - bubbling to parent");
});

body.addEventListener("click", (e) => {
  console.log("body bubble - bubbled to top");
});

// Order when we click btn:
// body capture -> section capture -> div capture -> btn TARGET -> div bubble -> section bubble -> body bubble

// ===== target vs currentTarget in bubbling =====
section.addEventListener("click", (e) => {
  console.log(e.target.id); // btn - where we started
  console.log(e.currentTarget.id); // section - where we are handling now
  console.log(e.eventPhase); // 1=capturing, 2=target, 3=bubbling
});

// ===== stopPropagation - we stop bubbling =====
btn.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("we stopped bubbling, parent won't hear us");
});

div.addEventListener("click", () => {
  console.log("we will NOT run if child stopped propagation");
});

// stopImmediatePropagation - we stop even other listeners on same element
btn.addEventListener("click", (e) => {
  e.stopImmediatePropagation();
  console.log("we are first listener, we stop others");
});

btn.addEventListener("click", () => {
  console.log("we will NOT run because previous stoppedImmediate");
});

// ===== Events that don't bubble vs that do =====
btn.addEventListener("focus", () => console.log("focus does NOT bubble"));
btn.addEventListener("blur", () => console.log("blur does NOT bubble"));
btn.addEventListener("mouseenter", () => console.log("mouseenter does NOT bubble"));
btn.addEventListener("mouseleave", () => console.log("mouseleave does NOT bubble"));

btn.addEventListener("click", () => console.log("click DOES bubble"));
btn.addEventListener("keydown", () => console.log("keydown DOES bubble"));
btn.addEventListener("mouseover", () => console.log("mouseover DOES bubble"));

// focus alternative that bubbles: focusin, focusout
btn.addEventListener("focusin", () => console.log("focusin DOES bubble - we can use this"));

// ===== Event Delegation - we use bubbling as power =====
// HTML: <ul id="list"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>

let list = document.getElementById("list");

// Instead of adding 3 listeners, we add ONE on parent
list.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("we clicked on", e.target.textContent, "via parent listener");
    e.target.classList.toggle("active");
  }
});

// Works for dynamic elements too - we don't need new listener
let newLi = document.createElement("li");
newLi.textContent = "Item 4 - added later";
list.appendChild(newLi); // our parent listener still catches it when we click it

// ===== preventDefault vs stopPropagation - we keep them separate =====
let link = document.querySelector("a");
link.addEventListener("click", (e) => {
  e.preventDefault(); // we stop browser default (navigation)
  console.log("we prevented navigation but event still bubbles");
});

link.addEventListener("click", (e) => {
  e.stopPropagation(); // we stop bubbling but browser default still happens if we didn't preventDefault
  console.log("we stopped bubbling but link would still navigate unless we prevented default");
});

// Both together
link.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("we stopped both default and bubbling");
});

// ===== capture to intercept before children =====
document.addEventListener("click", (e) => {
  console.log("we intercept at document level in capture, before any child");
  // we can decide to stop it before it reaches button
  // e.stopPropagation();
}, { capture: true });