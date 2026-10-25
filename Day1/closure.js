// Example code explaining closure :-

// 1. Basic closure
function outer() {
  let count = 10; // outer variable
  function inner() {
    console.log(count); // inner remembers count
  }
  return inner;
}
const closureFn = outer(); // outer finished
closureFn(); // 10 - still remembers

// 2. State preservation
function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const counter1 = makeCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter1()); // 3

const counter2 = makeCounter(); // independent closure
console.log(counter2()); // 1

// 3. Data privacy / Module pattern
function createPerson(name) {
  let _name = name; // private
  return {
    getName: () => _name,
    setName: (newName) => { _name = newName; }
  };
}
const person = createPerson("John");
console.log(person.getName()); // John
person.setName("Doe");
console.log(person.getName()); // Doe
// console.log(person._name) // undefined

// 4. Function factory
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}
const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// 5. Closure with setTimeout / Callback
function delayedMessage(msg) {
  setTimeout(function() {
    console.log(msg); // remembers msg after outer is done
  }, 1000);
}
delayedMessage("Hello after 1 sec");

// 6. Classic interview issue: loop with var vs let
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log("var i: " + i), 100); // 4,4,4
}
for (let j = 1; j <= 3; j++) {
  setTimeout(() => console.log("let j: " + j), 100); // 1,2,3 - new closure each time
}