// Example code explaining call stack behaviour:-

function third() {
  console.log("Inside third");
  // third() context is on top of stack
  // When finishes, it will be popped
}

function second() {
  console.log("Inside second - calling third()");
  third(); // Push third() to stack
  console.log("Back to second");
}

function first() {
  console.log("Inside first - calling second()");
  second(); // Push second() to stack
  console.log("Back to first");
}

console.log("Global Start"); // Global Context at bottom
first(); // Push first() to stack
console.log("Global End");

// Stack Flow:
// 1. Push Global
// 2. Push first() -> call second()
// 3. Push second() -> call third()
// 4. Push third() -> executes -> Pop third()
// 5. Back to second() -> finishes -> Pop second()
// 6. Back to first() -> finishes -> Pop first()
// 7. Global finishes -> Pop Global -> Stack Empty