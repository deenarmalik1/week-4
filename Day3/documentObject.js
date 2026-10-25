// Here is example code explaining document Object in javascript:-

// ===== DOCUMENT OBJECT =====
console.log(window.document === document); // true - document is property of window
console.log(document.URL); // page URL
console.log(document.title); // <title> content
console.log(document.readyState); // loading, interactive, complete
console.log(document.characterSet); // UTF-8
console.log(document.activeElement); // currently focused element

// ===== DOM STRUCTURE =====
console.log(document); // #document - root node
console.log(document.documentElement); // <html>
console.log(document.head); // <head>
console.log(document.body); // <body>
console.log(document.body.parentElement); // <html>

// Tree traversal
console.log(document.body.children); // HTMLCollection of direct child elements
console.log(document.body.childNodes); // NodeList including text nodes, comments
console.log(document.body.firstChild);
console.log(document.body.firstElementChild);
console.log(document.body.lastElementChild);

let div = document.createElement("div");
let p = document.createElement("p");
p.textContent = "Hello";
div.appendChild(p);
console.log(div.children[0] === p); // true
console.log(p.parentNode === div); // true
console.log(p.parentElement === div); // true
console.log(p.nextSibling);
console.log(p.previousSibling);

// Node types
console.log(document.body.nodeType); // 1 - ELEMENT_NODE
console.log(document.body.firstChild.nodeType); // 3 - TEXT_NODE if whitespace
console.log(document.ELEMENT_NODE); // 1
console.log(document.TEXT_NODE); // 3

// Live collections
console.log(document.images); // HTMLCollection of <img>
console.log(document.links); // HTMLCollection of <a> with href
console.log(document.forms); // HTMLCollection of <form>
console.log(document.scripts); // HTMLCollection of <script>

// ===== SELECTING ELEMENTS =====

// HTML needed for demo:
// <div id="main" class="container box"> <p class="text">First</p> <p class="text">Second</p> <input name="username"> </div>

// a) getElementById - single element, fastest
let main = document.getElementById("main"); // null if not found
console.log(main);
console.log(main.id); // "main"

// b) getElementsByClassName - LIVE HTMLCollection
let containers = document.getElementsByClassName("container");
console.log(containers); // HTMLCollection
console.log(containers[0]);
console.log(containers.length);
// Live: auto-updates
let boxCount = document.getElementsByClassName("box").length;
let newBox = document.createElement("div");
newBox.className = "box";
document.body.appendChild(newBox);
console.log(document.getElementsByClassName("box").length); // length increased by 1

// c) getElementsByTagName - LIVE HTMLCollection
let allDivs = document.getElementsByTagName("div");
let allParagraphs = document.getElementsByTagName("p");
console.log(allDivs.length);
console.log(allParagraphs[0].textContent);

// d) getElementsByName - for form elements
let usernameFields = document.getElementsByName("username");
console.log(usernameFields[0]);

// e) querySelector - first match, uses CSS selector
let firstText = document.querySelector(".text"); // first .text
let byId = document.querySelector("#main"); // same as getElementById
let firstPInDiv = document.querySelector("div p"); // descendant
let directChild = document.querySelector("div > p"); // direct child
let byAttr = document.querySelector('[name="username"]');
let complex = document.querySelector("div.container > p.text:first-child");
console.log(firstText); // <p class="text">First</p>
console.log(byId);

// f) querySelectorAll - ALL matches, STATIC NodeList
let allText = document.querySelectorAll(".text"); // NodeList
console.log(allText); // NodeList(2) [p.text, p.text]
console.log(allText[0]);
console.log(allText.length);
allText.forEach(el => console.log(el.textContent)); // NodeList has forEach

let allDivsQS = document.querySelectorAll("div");
let inputs = document.querySelectorAll('input[type="text"]');

// STATIC vs LIVE difference
let staticList = document.querySelectorAll(".box");
let liveList = document.getElementsByClassName("box");
console.log(staticList.length, liveList.length); // same initially
document.body.appendChild(document.createElement("div")).className = "box";
console.log(staticList.length); // NOT updated - static snapshot
console.log(liveList.length); // updated - live collection

// g) Searching INSIDE element - scoped search
let container = document.querySelector("#main");
let insideP = container.querySelector("p"); // only inside #main
let insideAllP = container.querySelectorAll("p"); // only inside #main
let childrenByClass = container.getElementsByClassName("text"); // only inside #main
console.log(insideP);

// h) closest and matches
let childP = document.querySelector("p.text");
console.log(childP.closest("#main")); // nearest ancestor with id=main
console.log(childP.closest("div")); // nearest div ancestor
console.log(childP.matches(".text")); // true - does it match selector?
console.log(childP.matches("div")); // false

// ===== CREATING / MANIPULATING =====
let newEl = document.createElement("section");
newEl.id = "new-section";
newEl.className = "box active";
newEl.textContent = "Dynamic";
newEl.setAttribute("data-id", "123");
console.log(newEl.getAttribute("data-id"));

document.body.appendChild(newEl); // add to DOM
document.body.prepend(newEl); // move to top
newEl.before(document.createElement("span")); // insert before
newEl.after(document.createElement("span")); // insert after
newEl.classList.add("visible");
newEl.classList.remove("active");
newEl.classList.toggle("show");

console.log(newEl.innerHTML);
console.log(newEl.textContent);
console.log(newEl.outerHTML);