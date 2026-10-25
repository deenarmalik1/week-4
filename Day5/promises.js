// ===== 1. STATES - pending, fulfilled, rejected for us =====
let pendingPromise = new Promise((resolve, reject) => {
  // we in pending now - waiting
});
console.log(pendingPromise); // we see Promise { <pending> }

let fulfilledPromise = Promise.resolve("we success value");
// Promise { <fulfilled>: "we success value" }

let rejectedPromise = Promise.reject("we error reason");
// Promise { <rejected>: "we error reason" }
rejectedPromise.catch(() => {}); // we handle to avoid unhandled rejection

// State locked - we can only settle once
let locked = new Promise((resolve, reject) => {
  resolve("we first - fulfilled");
  reject("we second - ignored, already locked");
  resolve("we third - ignored");
});
locked.then(v => console.log(v)); // we get only first

// ===== 2. CREATION - how we create =====
let promise1 = new Promise((resolve, reject) => {
  console.log("we executor runs sync immediately");
  setTimeout(() => {
    let success = true;
    if (success) resolve("we data");
    else reject("we failed");
  }, 1000);
});

// Wrapping callback API into promise - what we do
function getUserCallback(id, callback) {
  setTimeout(() => callback(null, { id }), 500);
}
function getUserPromise(id) {
  return new Promise((resolve, reject) => {
    getUserCallback(id, (err, user) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
}

// Quick creation helpers we use
let pResolve = Promise.resolve("we immediate fulfilled");
let pReject = Promise.reject("we immediate rejected").catch(e => console.log(e));

// ===== 3. .then() - we handle success =====
let fetchPromise = new Promise((resolve) => {
  setTimeout(() => resolve("we user data"), 500);
});

fetchPromise.then((data) => {
  console.log("we got in then", data);
});

fetchPromise.then(
  (data) => console.log("we success handler", data),
  (err) => console.log("we error handler", err)
);

// then returns new Promise - key for us
let thenReturns = Promise.resolve("we 1");
let newPromise = thenReturns.then((val) => {
  console.log(val);
  return "we 2"; // we return value -> next then gets it wrapped in Promise.resolve("we 2")
});
newPromise.then(val => console.log(val));

// Returning promise inside then - we wait
Promise.resolve("we user id 1")
  .then(id => {
    return new Promise(resolve => setTimeout(() => resolve(`we posts for ${id}`), 500));
  })
  .then(posts => console.log(posts)); // we waits for inner promise

// Throw inside then -> goes to catch
Promise.resolve("we data")
  .then(() => {
    throw new Error("we error inside then");
  })
  .catch(err => console.log("we caught", err.message));

// ===== 4. .catch() - we handle errors =====
let failing = new Promise((_, reject) => setTimeout(() => reject("we network error"), 500));

failing
  .then(data => console.log("we skip this on error"))
  .catch(err => console.log("we catch error", err))
  .finally(() => console.log("we finally - always runs"));

// Centralized catch for chain
Promise.resolve()
  .then(() => { throw new Error("we fail at step1"); })
  .then(() => console.log("we skipped"))
  .then(() => console.log("we skipped"))
  .catch(err => console.log("we one catch handles all", err.message));

// catch can recover and continue chain
Promise.reject("we error")
  .catch(err => {
    console.log("we handle", err);
    return "we recovered value"; // we return -> chain becomes fulfilled
  })
  .then(val => console.log("we continue after catch", val));

// .catch is sugar for then(null, onRejected)
let p = Promise.reject("we err");
p.then(null, err => console.log("we via then second arg", err));

// Unhandled if we forget catch
// Promise.reject("we will warn in console - unhandled rejection");

// ===== 5. CHAINING .then() - how we avoid callback hell =====
// Pyramid we had vs Chain we want
// Callback hell chain converted to promise chain
function getUser(id) {
  return new Promise(res => setTimeout(() => res({ id, name: "we user" }), 300));
}
function getPosts(userId) {
  return new Promise(res => setTimeout(() => res([{ id: 101, userId }]), 300));
}
function getComments(postId) {
  return new Promise(res => setTimeout(() => res([{ id: 201, postId }]), 300));
}

// Chaining - linear for us
getUser(1)
  .then(user => {
    console.log("we got user", user);
    return getPosts(user.id); // we return promise
  })
  .then(posts => {
    console.log("we got posts", posts);
    return getComments(posts[0].id); // we return promise
  })
  .then(comments => {
    console.log("we got comments", comments);
    return "we final result";
  })
  .then(final => console.log(final))
  .catch(err => console.log("we catch any step error", err));

// Chain transforms data
Promise.resolve(5)
  .then(v => { console.log("we", v); return v * 2; }) // we 5 -> 10
  .then(v => { console.log("we", v); return v * 2; }) // we 10 -> 20
  .then(v => console.log("we final", v)); // we 20

// Promise.all chain we use for parallel
Promise.all([getUser(1), getPosts(1), getComments(101)])
  .then(([user, posts, comments]) => {
    console.log("we all parallel done", user, posts, comments);
  });

// Promise combinators we use
Promise.all([Promise.resolve("we a"), Promise.resolve("we b")])
  .then(vals => console.log("we all", vals));

Promise.race([getUser(1), getPosts(1)])
  .then(first => console.log("we race winner", first));

Promise.allSettled([Promise.resolve("we ok"), Promise.reject("we fail")])
  .then(results => console.log("we allSettled", results));

Promise.any([Promise.reject("we fail1"), Promise.resolve("we success")])
  .then(val => console.log("we any first success", val));