// ===== 1. GLOBAL OBJECT - environment dependent =====
console.log(window === globalThis); // true in browser - window IS global object
// In Node: global === globalThis
// In Workers: self === globalThis

// All globals are properties of window
var myVar = 10;
function myFunc() {}
console.log(window.myVar); // 10 - var becomes window property
console.log(window.myFunc); // function

let myLet = 20;
const myConst = 30;
console.log(window.myLet); // undefined - let/const not as direct property
console.log(globalThis.myLet); // 20 - but available via globalThis in global scope
console.log(myLet); // 20 - directly accessible

console.log(window.Array); // built-in
console.log(window.console); // built-in
console.log(window.setTimeout); // browser API but on window

// ===== 2. WINDOW = Browser Window Representation =====

// a) Window as global object - you can omit window.
console.log(window.alert === alert); // true
// window.alert("hi") same as alert("hi")

// b) Window as browser controller - NOT part of JS language
console.log(window.innerWidth); // viewport width
console.log(window.innerHeight); // viewport height
console.log(window.location); // URL info
console.log(window.location.href); // https://example.com
console.log(window.navigator.userAgent); // browser info
console.log(window.history.length); // history count

// window methods to control browser
// window.open("https://google.com")
// window.close()
// window.scrollTo(0,0)

// ===== 3. DOM - document is property of window =====
console.log(window.document); // document object
console.log(document === window.document); // true - can omit window
console.log(window.document === window.window.document); // true - window.window = window

// DOM tree access
console.log(document.documentElement); // <html>
console.log(document.head); // <head>
console.log(document.body); // <body>
console.log(document.title); // page title
console.log(document.URL); // same as location.href

// DOM methods - HTML manipulation
// document.getElementById("myId")
// document.querySelector(".myClass")
// document.createElement("div")

let el = document.createElement("div");
el.textContent = "Hello DOM";
document.body.appendChild(el); // adds to DOM tree
console.log(el.parentElement === document.body); // true

// Event listening via DOM
el.addEventListener("click", () => console.log("clicked"));

// ===== HIERARCHY =====
console.log(window); // top: represents browser tab/window
console.log(window.document); // property of window: the page
console.log(document.body); // property of document: content
console.log(document.body.children); // HTMLCollection

// iframe has its own window and document
let iframe = document.createElement("iframe");
document.body.appendChild(iframe);
console.log(iframe.contentWindow !== window); // true - different window
console.log(iframe.contentDocument !== document); // true - different document
console.log(iframe.contentWindow.parent === window); // true

// Scope lookup ends at window
let x = 5;
console.log(window.x); // undefined if x is let, but conceptually...
console.log(x); // 5 - found in global scope (window in browser)