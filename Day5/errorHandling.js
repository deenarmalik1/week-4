// ===== 1. try...catch...finally, throw - 

// Basic throw and catch
try {
  console.log("we try start");
  throw new Error("we something went wrong");
} catch (err) {
  console.log("we catch", err.name, err.message); // Error we something went wrong
  console.log("we stack", err.stack);
}

try {
  let x = 10;
  console.log("we no error here, catch skipped");
} catch (e) {
  console.log("we skipped");
} finally {
  console.log("we finally always runs even without error");
}

// finally runs even with return
function withReturn() {
  try {
    return "we from try";
  } catch (e) {
    return "we from catch";
  } finally {
    console.log("we finally runs before return");
  }
}
console.log(withReturn());

// finally runs even with throw
try {
  try {
    throw new Error("we inner error");
  } finally {
    console.log("we inner finally before outer catch");
  }
} catch (e) {
  console.log("we outer catch", e.message);
}

// catch only sync in same context, not async callback
try {
  setTimeout(() => {
    throw new Error("we this will NOT be caught by outer try");
  }, 100);
} catch (e) {
  console.log("we never catches timeout error");
}

// Correct way for async callback
setTimeout(() => {
  try {
    throw new Error("we now caught inside callback");
  } catch (e) {
    console.log("we caught inside setTimeout", e.message);
  }
}, 100);

// Types of errors we get
try {
  nonexistentVar; // ReferenceError
} catch (e) {
  console.log("we ReferenceError", e.name);
}
try {
  null.foo(); // TypeError
} catch (e) {
  console.log("we TypeError", e.name);
}
try {
  new Array(-1); // RangeError
} catch (e) {
  console.log("we RangeError", e.name);
}

// Custom error we create
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}

function validateUser(user) {
  if (!user.name) throw new ValidationError("we name required");
  if (!user.age) throw new ValidationError("we age required");
  return true;
}

try {
  validateUser({ age: 20 });
} catch (e) {
  if (e instanceof ValidationError) console.log("we handle validation", e.message);
  else if (e instanceof NetworkError) console.log("we handle network", e.message);
  else console.log("we unknown error", e);
}

// Re-throw we do for layering
try {
  try {
    throw new NetworkError("we db down");
  } catch (e) {
    console.log("we inner logs", e.message);
    throw e; // we re-throw to outer
  }
} catch (e) {
  console.log("we outer handles", e.message);
}

// ===== 2. Errors in Promises we =====

function resolveAfter(val, ms) { return new Promise(r => setTimeout(() => r(val), ms)); }
function rejectAfter(reason, ms) { return new Promise((_, r) => setTimeout(() => r(reason), ms)); }

// reject vs throw inside executor
let p1 = new Promise((resolve, reject) => {
  reject(new Error("we rejected via reject()"));
});
p1.catch(err => console.log("we p1 caught", err.message));

let p2 = new Promise(() => {
  throw new Error("we thrown inside executor = reject");
});
p2.catch(err => console.log("we p2 caught", err.message));

// throw inside then becomes rejection
Promise.resolve("we ok")
  .then(val => {
    throw new Error("we error inside then");
  })
  .then(() => console.log("we skipped"))
  .catch(err => console.log("we then throw caught in catch", err.message));

// .catch chaining
resolveAfter("we start", 100)
  .then(() => rejectAfter("we fail at step 2", 100))
  .then(() => console.log("we skipped due to rejection"))
  .then(() => console.log("we also skipped"))
  .catch(err => console.log("we first catch catches", err))
  .then(() => console.log("we after catch continues - chain recovered"));

// finally on promise
Promise.resolve("we data")
  .then(v => console.log("we then", v))
  .catch(e => console.log(e))
  .finally(() => console.log("we promise finally - cleanup"));

rejectAfter("we error", 100)
  .catch(e => console.log("we catch", e))
  .finally(() => console.log("we finally even after reject"));

// finally doesn't change result unless throws
Promise.resolve("we original")
  .finally(() => console.log("we finally no args"))
  .then(v => console.log("we value still", v));

Promise.resolve("we original")
  .finally(() => { throw new Error("we error in finally overrides"); })
  .then(v => console.log("we skipped"))
  .catch(e => console.log("we finally throw overrides", e.message));

// Unhandled rejection we must avoid
// rejectAfter("we unhandled", 100); // if no catch -> UnhandledPromiseRejection warning

// Global safety nets
// window.addEventListener("unhandledrejection", e => console.log("we global unhandled", e.reason));
// window.addEventListener("error", e => console.log("we global error", e.message));

// ===== 3. async/await bridging sync and promises we =====

async function asyncErrorHandling() {
  try {
    let data = await rejectAfter("we fetch failed", 100);
    console.log("we skipped");
  } catch (e) {
    console.log("we await rejection became throw, caught", e);
  } finally {
    console.log("we async finally");
  }
}
asyncErrorHandling();

async function rethrowAsync() {
  try {
    await rejectAfter("we inner fail", 100);
  } catch (e) {
    console.log("we inner catch logs", e);
    throw new Error("we wrapped error"); // we becomes rejection of this async function
  }
}
rethrowAsync()
  .then(() => console.log("we skipped"))
  .catch(e => console.log("we outer catch for async function rejection", e.message));

async function withoutTryCatch() {
  let data = await rejectAfter("we no try inside", 100); // we rejection bubbles
  return data;
}
withoutTryCatch().catch(e => console.log("we caller must catch", e));

// try...catch around await vs .catch() same
async function twoWays() {
  // way 1: try/catch
  try {
    await rejectAfter("we err", 100);
  } catch (e) {
    console.log("we way1 try/catch", e);
  }
  // way 2: .catch on awaited promise
  let result = await rejectAfter("we err2", 100).catch(e => {
    console.log("we way2 .catch on promise before await", e);
    return "we recovered";
  });
  console.log("we after recovery", result);
}
twoWays();

// Operational vs Programmer error we differentiate
async function fetchData(url) {
  try {
    if (!url) throw new TypeError("we programmer error: url required"); // we bug - should fix
    let data = await rejectAfter(new NetworkError("we network down"), 100); // we operational - can retry
    return data;
  } catch (e) {
    if (e instanceof NetworkError) {
      console.log("we retryable operational", e.message);
    } else if (e instanceof TypeError) {
      console.log("we programmer error, crash fast", e.message);
      throw e;
    }
  }
}
fetchData("");
fetchData("/api");