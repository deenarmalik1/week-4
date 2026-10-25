// ===== math.js - named exports we have =====
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function sub(a, b) { return a - b; }
export let count = 0;
export function inc() { count++; } // we live binding - importer sees updated count

// ===== logger.js - default export we have =====
export default function log(msg) {
  console.log("we log", msg);
}
// only one default per file

// ===== utils.js - mixed we have =====
export const VERSION = "1.0";
function formatDate(d) { return d.toISOString(); }
export { formatDate }; // we re-export syntax


// ===== constants.js - re-export we have =====
export { PI } from "./math.js"; // we re-export from other module
export * from "./math.js"; // we re-export all named

// ===== main.js - imports we use =====
// Named imports - must match name, need .js extension in browser ESM
import { PI, add, count, inc } from "./math.js";
console.log(PI);
console.log(add(2, 3));
console.log(count); // 0
inc();
console.log(count); // 1 - live binding updated

// Rename import we do
import { add as sum } from "./math.js";
console.log(sum(5, 5));

// Default import - any name we choose
import logger from "./logger.js";
import myLogger from "./logger.js"; // same, name free
logger("we default import");

// Namespace import - all in object
import * as MathUtils from "./math.js";
console.log(MathUtils.PI);
console.log(MathUtils.add(1, 2));

// Mixed default + named
import utilsDefault, { VERSION, formatDate } from "./utils.js";
console.log(utilsDefault);
console.log(VERSION);

// Side effect import - we run file but no bindings
import "./init.js"; // we file runs for side effect like polyfill, global setup

// Dynamic import - lazy load we use for performance
async function loadLazily() {
  if (true) {
    let { add } = await import("./math.js"); // we returns promise
    console.log("we dynamic", add(10, 20));
  }
}
loadLazily();

let moduleName = "./math.js";
import(moduleName).then(mod => console.log("we dynamic variable", mod.PI));

// Top-level await we can in ESM only
let userModule = await import("./math.js");
console.log("we top-level await", userModule.PI);

// ===== CommonJS - legacy Node we still see =====
// file: cjs-math.js
// const PI = 3.14;
// function add(a,b){ return a+b; }
// module.exports = { PI, add }; // we export object
// exports.add = add; // we alternative shorthand
// module.exports = function(){} // we export single function

// file: cjs-main.js
// const { PI, add } = require("./cjs-math.js"); // we sync require
// const math = require("./cjs-math.js");
// const logger = require("./logger.cjs");
// console.log(require("./math.js").PI); // we can require inside function/if

// ===== package.json type we configure =====
// { "type": "module" } -> .js treated as ESM, need .cjs for CommonJS
// { "type": "commonjs" } -> .js treated as CJS, need .mjs for ESM

// ===== Circular we avoid =====
// a.js: import { b } from "./b.js"; export let a = "a"; console.log(b);
// b.js: import { a } from "./a.js"; export let b = "b"; console.log(a); // a may be undefined due to partial init

// ===== Browser HTML we =====
// <script type="module" src="./main.js"></script> // we deferred by default
// <script type="module"> import { add } from "./math.js"; console.log(add(1,2)); </script>
// <script nomodule src="./fallback.js"></script> // we old browser fallback

// ===== Re-export barrel file we use =====
// index.js
// export { default as logger } from "./logger.js";
// export * from "./math.js";
// export { VERSION } from "./utils.js";
// Then: import { logger, PI, VERSION } from "./index.js" // we clean imports