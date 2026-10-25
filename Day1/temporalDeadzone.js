// Example code explaining temporal dead zone:-

// TDZ starts for 'a' when block starts
{
  // --- TDZ for a starts here ---
  // console.log(a); // ReferenceError: Cannot access 'a' before initialization

  console.log(b); // undefined - var has no TDZ
  var b = 10;

  // --- Still in TDZ for a ---
  
  let a = 20; // TDZ ends here for 'a'

  console.log(a); // 20 - Now accessible
}

function test() {
  // TDZ for x and y starts
  // console.log(x); // ReferenceError
  
  let x = 5;
  const y = 10;
  // TDZ ends for x and y

  console.log(x + y); // 15
}
test();

let c = 1;
{
  // console.log(c); // ReferenceError - TDZ due to shadowing
  let c = 2;
  console.log(c); // 2
}