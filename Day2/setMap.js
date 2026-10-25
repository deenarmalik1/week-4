// Example code explaining set,map,weakMap,and weakSet in javascript :-

// ===== SET =====
const set = new Set([1, 2, 2, 3, 3]);
console.log(set); // Set {1,2,3}
console.log(set.size); // 3 not length

set.add(4);
set.add(2); // ignored - duplicate
console.log(set.has(2)); // true - O(1) fast lookup
set.delete(1);
console.log(set);

// No index access
// console.log(set[0]) // undefined

// Iteration - Set is iterable
for (let val of set) {
  console.log(val);
}

// Remove duplicates from array - most common use
const arr = [1,1,2,2,3];
const unique = [...new Set(arr)]; // [1,2,3]

// Array vs Set lookup
const arrCheck = [1,2,3,4,5];
console.log(arrCheck.includes(3)); // O(n) - loops
console.log(set.has(3)); // O(1) - optimized

// ===== MAP =====
const map = new Map();

// Any type as key - biggest diff from Object
let objKey = { id: 1 };
let funcKey = function(){};
map.set("name", "John"); // string key
map.set(42, "number key"); // number key
map.set(true, "boolean key");
map.set(objKey, "object value"); // object as key
map.set(funcKey, "function as key");
map.set(NaN, "NaN can be key");

console.log(map.size); // 6 - direct property
console.log(map.get(objKey)); // "object value"
console.log(map.has(42)); // true
map.delete(true);

for (let [key, value] of map) {
  console.log(key, value);
}

// Map vs Object
const obj = {};
obj["name"] = "John";
obj[42] = "becomes string '42'"; // key forced to string
obj[objKey] = "becomes '[object Object]'"; // fails
console.log(Object.keys(obj).length); // manual size calc

// Map preserves any key type correctly
console.log(map.get(42) !== map.get("42")); // true - different keys

// No prototype pollution
console.log(map.has("toString")); // false - pure map
console.log(obj["toString"]); // [object] exists from prototype

// ===== WeakSet =====
let user1 = { name: "John" };
let user2 = { name: "Doe" };

const weakSet = new WeakSet();
weakSet.add(user1);
weakSet.add(user2);
console.log(weakSet.has(user1)); // true
// weakSet.add("string") // TypeError - only objects allowed

user1 = null; // reference removed
// user1 object will be garbage collected automatically from weakSet
// console.log(weakSet.size) // undefined - no size
// for(let v of weakSet) {} // TypeError - not iterable

// Use case: tracking visited objects
function markVisited(obj) {
  if (!weakSet.has(obj)) {
    weakSet.add(obj);
    console.log("First visit");
  }
}

// ===== WeakMap =====
let user = { name: "Alice" };
const weakMap = new WeakMap();

weakMap.set(user, { visits: 1 }); // key must be object, value can be anything
console.log(weakMap.get(user)); // { visits: 1 }

// weakMap.set("key", "value") // TypeError - key must be object

user = null; // key has no other reference -> entry auto removed -> prevents memory leak

// Main use case: Private data / Cache without memory leak
let cache = new WeakMap();
function getData(obj) {
  if (!cache.has(obj)) {
    cache.set(obj, { computed: Math.random() }); // heavy calc cached
  }
  return cache.get(obj);
}
let product = { id: 1 };
console.log(getData(product));
// when product = null, cached data is also GC'd automatically

// Not iterable
// console.log(weakMap.size) // undefined
// for(let x of weakMap) {} // TypeError