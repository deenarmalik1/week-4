// Example code explaining short-circuiting in javascript:-

// ===== FALSY VALUES REFERENCE =====
// false, 0, -0, 0n, "", null, undefined, NaN -> falsy
// Everything else -> truthy

// ===== OR || - Returns first truthy, short-circuits on truthy =====

console.log(true || false); // true
console.log(false || true); // true

console.log("Hello" || "World"); // "Hello" - first truthy returned, second not evaluated
console.log("" || "World"); // "World" - "" is falsy, so returns second
console.log(0 || 100); // 100
console.log(null || "default"); // "default"
console.log(undefined || "fallback"); // "fallback"

// Short-circuit: second operand NOT evaluated if first is truthy
function second() { console.log("second called"); return "second"; }
console.log("first" || second()); // "first" - second() never called, no log
console.log(false || second()); // logs "second called", returns "second"

// Classic use: Default values
let username;
let displayName = username || "Guest"; // "Guest" because username is undefined
console.log(displayName);

let count = 0;
let displayCount = count || 10; // 10 - BUG! 0 is falsy but valid
console.log(displayCount);

// Fix with ?? (nullish coalescing) - only null/undefined trigger fallback
let correctCount = count ?? 10; // 0 - keeps 0
console.log(correctCount);

// Returns actual value, not boolean
console.log(0 || false || null); // null - last falsy if all falsy

// ===== AND && - Returns first falsy, short-circuits on falsy =====

console.log(true && false); // false
console.log(true && true); // true

console.log("Hello" && "World"); // "World" - first truthy, returns second
console.log("" && "World"); // "" - first falsy returned, second not evaluated
console.log(0 && 100); // 0

// Short-circuit: second NOT evaluated if first is falsy
function expensive() { console.log("expensive called"); return "result"; }
console.log(false && expensive()); // false - expensive() never called
console.log(true && expensive()); // logs "expensive called", returns "result"

// Guarded execution - avoid error
let user = null;
// console.log(user.name) // TypeError
console.log(user && user.name); // null - short-circuits, safe

let loggedInUser = { name: "John" };
console.log(loggedInUser && loggedInUser.name); // "John"

let isLoggedIn = true;
isLoggedIn && console.log("Welcome!"); // logs only if isLoggedIn is truthy

// Returns actual value, not boolean
console.log(true && 0 && "hello"); // 0 - first falsy
console.log("a" && "b" && "c"); // "c" - last truthy if all truthy

// ===== COMBINED / REAL WORLD =====

// React style conditional rendering logic
let hasError = false;
let data = { id: 1 };
console.log(hasError || (data && data.id)); // 1

// Chaining
console.log(null || undefined || 0 || "" || "final"); // "final"
console.log("first" && 0 && "third"); // 0

// Difference || vs ??
console.log(0 || 100); // 100
console.log(0 ?? 100); // 0 - ?? only checks null/undefined
console.log("" || "default"); // "default"
console.log("" ?? "default"); // "" 
console.log(null ?? "default"); // "default"
console.log(undefined ?? "default"); // "default"