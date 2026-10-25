// Here is example code explaining Symbol and BigInt in javascript:-

// ===== SYMBOL =====

// Creation - every Symbol is unique
const sym1 = Symbol();
const sym2 = Symbol("id"); // description for debugging only
const sym3 = Symbol("id");
console.log(sym2 === sym3); // false - always unique even with same description
console.log(typeof sym1); // "symbol"

// Cannot use new
// const s = new Symbol(); // TypeError

// 1. Unique object keys - no collision
const ID = Symbol("id");
const user = {
  name: "John",
  [ID]: 123, // Symbol as key
};
user[ID] = 456;
console.log(user[ID]); // 456
console.log(user.ID); // undefined - not same

// Even same description won't collide
const user2 = {
  [Symbol("id")]: "first",
  [Symbol("id")]: "second" // two different keys
};

// 2. Hidden / non-enumerable
console.log(Object.keys(user)); // ["name"] - Symbol not listed
console.log(Object.getOwnPropertyNames(user)); // ["name"]
console.log(JSON.stringify(user)); // {"name":"John"} - Symbol skipped
console.log(Object.getOwnPropertySymbols(user)); // [ Symbol(id) ] - way to get them
console.log(user[Object.getOwnPropertySymbols(user)[0]]); // 456

// 3. Global registry - Symbol.for()
const globalSym1 = Symbol.for("app.id");
const globalSym2 = Symbol.for("app.id");
console.log(globalSym1 === globalSym2); // true - same from registry
console.log(Symbol.keyFor(globalSym1)); // "app.id"

const localSym = Symbol("app.id");
console.log(Symbol.keyFor(localSym)); // undefined - not in global registry

// 4. Well-known Symbols - customize object behavior
const obj = {
  name: "MyObject",
  [Symbol.toStringTag]: "MyCustomObject"
};
console.log(Object.prototype.toString.call(obj)); // [object MyCustomObject]

const myList = {
  values: [1,2,3],
  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => ({
        value: this.values[i++],
        done: i > this.values.length
      })
    };
  }
};
console.log([...myList]); // [1,2,3] - now iterable

// ===== BigInt =====

// Creation
const big1 = 9007199254740991n; // n suffix
const big2 = BigInt(9007199254740991); // constructor
const big3 = BigInt("9007199254740991999999"); // from string for huge numbers
console.log(typeof big1); // "bigint"
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

// Precision loss vs BigInt
console.log(9007199254740991 + 1); // 9007199254740992 - ok
console.log(9007199254740991 + 2); // 9007199254740992 - WRONG! precision lost
console.log(9007199254740991n + 2n); // 9007199254740993n - correct

// 1. Cannot mix Number and BigInt
// console.log(10n + 5); // TypeError
console.log(10n + BigInt(5)); // 15n - explicit conversion
console.log(Number(10n) + 5); // 15 - convert to Number
console.log(10n + 5n); // 15n

// 2. No floating point - integer only
console.log(10n / 3n); // 3n - truncates, not 3.33n
// console.log(10n / 3.5) // TypeError
// const invalid = 10.5n; // SyntaxError

// 3. Operations
console.log(10n + 20n); // 30n
console.log(10n - 5n); // 5n
console.log(10n * 2n); // 20n
console.log(10n % 3n); // 1n
console.log(2n ** 10n); // 1024n
console.log(10n > 5n); // true

// Math methods don't work
// console.log(Math.sqrt(16n)) // TypeError
// console.log(Math.max(1n, 2n)) // TypeError

// 4. Truthy / typeof
console.log(0n ? true : false); // false - 0n is falsy
console.log(1n ? true : false); // true
console.log(0n == 0); // true - loose equality
console.log(0n === 0); // false - different types