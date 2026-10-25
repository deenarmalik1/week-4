// ===== NUMBERS =====

// Types
let a = 42; // integer
let b = 3.14; // float - both are 'number'
let big = 9007199254740991n; // BigInt
console.log(typeof a); // number
console.log(Number.isNaN(NaN)); // true
console.log(1/0); // Infinity
console.log(0.1 + 0.2); // 0.30000000000000004

// Safe integer check
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.isSafeInteger(9007199254740991));

// Different formats
let hex = 0xFF; // 255
let octal = 0o77; // 63
let binary = 0b1010; // 10
let exp = 2e3; // 2000

// Number methods
console.log(Number.isInteger(10.5)); // false
console.log(parseInt("100px")); // 100
console.log(parseFloat("3.14abc")); // 3.14
console.log((10.12345).toFixed(2)); // "10.12"

// ===== MATH =====

// Rounding
console.log(Math.floor(4.9)); // 4
console.log(Math.ceil(4.1)); // 5
console.log(Math.round(4.5)); // 5
console.log(Math.trunc(4.9)); // 4

console.log(Math.abs(-5)); // 5
console.log(Math.pow(2, 3)); // 8 -> or 2**3
console.log(Math.sqrt(16)); // 4
console.log(Math.min(1,5,2)); // 1
console.log(Math.max(1,5,2)); // 5

// Random 0 to 1 exclusive
console.log(Math.random());
// Random integer 0-10
let rand0to10 = Math.floor(Math.random() * 11);
// Random integer min to max inclusive
function randMinMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(randMinMax(10, 20));

// Trig
console.log(Math.sin(Math.PI / 2)); // 1

// ===== DATE =====

// 4 ways to create
let d1 = new Date(); // now
let d2 = new Date(0); // epoch + 0ms -> 1970
let d3 = new Date("2026-05-13"); // from string
let d4 = new Date(2026, 4, 13, 10, 30, 0); // year, month(0-indexed), day, h,m,s

// Get components
let now = new Date();
console.log(now.getFullYear());
console.log(now.getMonth()); // 0-11
console.log(now.getDate()); // 1-31
console.log(now.getDay()); // 0-6 Sun-Sat
console.log(now.getHours());
console.log(now.getMinutes());

// UTC versions
console.log(now.getUTCHours());

// Set components
now.setFullYear(2027);
now.setMonth(0); // Jan

// Timestamp
console.log(Date.now()); // ms since 1970
console.log(now.getTime()); // ms of this date
console.log(Date.now() === new Date().getTime()); // similar

// Difference / Comparison
let date1 = new Date("2026-01-01");
let date2 = new Date("2026-01-10");
let diffMs = date2 - date1;
let diffDays = diffMs / (1000 * 60 * 60 * 24);
console.log(diffDays); // 9

console.log(date2 > date1); // true