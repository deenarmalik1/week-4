// ===== WINDOW IS GLOBAL OBJECT =====
console.log(window === globalThis); // true - window is browser's global object
console.log(window.window === window); // true - window references itself
console.log(window.self === window); // true

// var and functions become window properties
var globalVar = 10;
function globalFunc() { return "hi"; }
console.log(window.globalVar); // 10
console.log(window.globalFunc()); // "hi"
console.log(globalVar); // 10 - window. prefix optional

// let/const not as direct property but still global
let myLet = 20;
const myConst = 30;
console.log(window.myLet); // undefined
console.log(window.myConst); // undefined
console.log(globalThis.myLet); // 20 - via globalThis
console.log(myLet); // 20 - directly accessible

// Built-ins are on window
console.log(window.Array === Array); // true
console.log(window.Math === Math); // true
console.log(window.console === console); // true
console.log(window.setTimeout === setTimeout); // true
console.log(window.fetch === fetch); // true

// Global scope lookup chain
let a = 5;
console.log(a); // 5 - finds in global which is window
console.log(window.a); // undefined if let, but still in scope

// ===== WINDOW AS BROWSER WINDOW API =====

// Document
console.log(window.document === document); // true
console.log(window.document.title);
console.log(document.URL);

// Location - URL control
console.log(window.location.href); // full URL
console.log(window.location.hostname); // example.com
console.log(window.location.pathname); // /page
console.log(window.location.search); // ?q=1
// window.location.href = "https://google.com"; // redirect
// window.location.reload();

// History
console.log(window.history.length);
console.log(window.history.state);
// window.history.back();
// window.history.forward();
// window.history.go(-1);

// Navigator - browser info
console.log(window.navigator.userAgent);
console.log(window.navigator.language);
console.log(window.navigator.onLine);
console.log(window.navigator.clipboard);

// Screen & Window size
console.log(window.innerWidth, window.innerHeight); // viewport
console.log(window.outerWidth, window.outerHeight); // with browser chrome
console.log(window.screen.width, window.screen.height); // full screen
console.log(window.screenX, window.screenY); // window position
console.log(window.devicePixelRatio);

// Storage
window.localStorage.setItem("key", "value");
console.log(window.localStorage.getItem("key"));
window.sessionStorage.setItem("temp", "123");

// Methods
window.alert("Hello");
let confirmed = window.confirm("Are you sure?");
let name = window.prompt("Your name?");

let id = window.setTimeout(() => console.log("timeout"), 1000);
window.clearTimeout(id);

let intervalId = window.setInterval(() => console.log("tick"), 1000);
window.clearInterval(intervalId);

// Scroll
// window.scrollTo(0, 0);
// window.scrollBy(0, 100);
// console.log(window.scrollY);

// Open/Close
// let newWin = window.open("https://example.com", "_blank", "width=400,height=400");
// newWin.close();

// Events on window
window.addEventListener("resize", () => {
  console.log(window.innerWidth);
});

window.addEventListener("load", () => {
  console.log("page loaded");
});

window.addEventListener("scroll", () => {
  console.log(window.scrollY);
});

// Iframe has own window
let iframe = document.createElement("iframe");
document.body.appendChild(iframe);
console.log(iframe.contentWindow !== window); // true
console.log(iframe.contentWindow.parent === window); // true

// Module scope vs window (in <script type="module">)
// var in module does NOT become window property