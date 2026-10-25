// ===== 1. async always returns Promise for us =====
async function asyncReturns() {
  return "we value"; // we wrapped to Promise.resolve("we value")
}
console.log(asyncReturns()); // we get Promise { <fulfilled>: "we value" }

async function asyncThrows() {
  throw new Error("we error"); // we wrapped to Promise.reject
}
asyncThrows().catch(e => console.log(e.message));

async function asyncWithPromise() {
  return Promise.resolve("we explicit promise");
}
asyncWithPromise().then(v => console.log(v));

// ===== 2. await pauses our function =====
function getUser(id) {
  return new Promise(res => setTimeout(() => res({ id, name: "we user" }), 500));
}
function getPosts(userId) {
  return new Promise(res => setTimeout(() => res([{ id: 101 }]), 500));
}

async function waitExample() {
  console.log("we start");
  let user = await getUser(1); // we pause here till fulfilled, not blocking main thread
  console.log("we got user", user); // we resume after
  let posts = await getPosts(user.id);
  console.log("we got posts", posts);
  console.log("we end");
}
waitExample();
console.log("we main thread continues - not blocked");

// await non-promise we do
async function awaitNonPromise() {
  let x = await 5; // we wraps 5 -> Promise.resolve(5)
  console.log("we", x); // 5
}
awaitNonPromise();

// ===== 3. try/catch/finally we use =====
function mayFail(shouldFail) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (shouldFail) rej("we network failed");
      else res("we success");
    }, 300);
  });
}

async function errorHandling() {
  try {
    let data = await mayFail(true);
    console.log("we skip - throws");
  } catch (err) {
    console.log("we caught", err); // we catch rejection like sync throw
  } finally {
    console.log("we finally always");
  }
}
errorHandling();

// One try/catch for multiple awaits - centralized we use
async function centralizedCatch() {
  try {
    let u = await getUser(1);
    let p = await getPosts(u.id);
    let c = await mayFail(false);
    console.log("we all ok", u, p, c);
  } catch (e) {
    console.log("we any step failed, one catch", e);
  }
}
centralizedCatch();

// catch can recover we do
async function recover() {
  try {
    await mayFail(true);
  } catch (e) {
    console.log("we handle", e);
    return "we recovered"; // we return -> promise fulfilled
  }
}
recover().then(v => console.log(v));

// ===== 4. Sequential vs Parallel - crucial for us =====
// Sequential - we wait each time - slow if independent
async function sequential() {
  console.time("we sequential");
  let u = await getUser(1); // we start, wait 500ms
  let p = await getPosts(1); // we start after u, wait 500ms -> total 1000ms
  console.timeEnd("we sequential");
}

// Parallel - we start together - fast we should use
async function parallel() {
  console.time("we parallel");
  let userPromise = getUser(1); // we start immediately
  let postsPromise = getPosts(1); // we start immediately - both running
  let u = await userPromise; // we wait
  let p = await postsPromise; // we wait - total ~500ms
  console.timeEnd("we parallel");
}

// Promise.all with await we use best
async function parallelBest() {
  let [user, posts] = await Promise.all([getUser(1), getPosts(1)]);
  console.log("we parallel done", user, posts);
}

// Dependency we must keep sequential
async function withDependency() {
  let user = await getUser(1); // we need user.id for next
  let posts = await getPosts(user.id); // we must wait user
  console.log("we dependent chain", posts);
}

// Loop mistake we avoid vs correct
async function loopWrong() {
  let ids = [1, 2, 3];
  // we wrong - sequential loop 1500ms
  for (let id of ids) {
    let u = await getUser(id);
    console.log("we loop sequential", u);
  }
}

async function loopCorrect() {
  let ids = [1, 2, 3];
  // we correct - parallel 500ms
  let promises = ids.map(id => getUser(id));
  let users = await Promise.all(promises);
  console.log("we loop parallel", users);
}

// ===== 5. Chaining .then vs async/await we compare =====
// Promise chain we had
function chainOld() {
  getUser(1)
    .then(user => getPosts(user.id))
    .then(posts => console.log("we chain", posts))
    .catch(err => console.log(err));
}

// Async/await we now - same but linear
async function chainNew() {
  try {
    let user = await getUser(1);
    let posts = await getPosts(user.id);
    console.log("we linear", posts);
  } catch (err) {
    console.log(err);
  }
}

// if/for works naturally we love
async function controlFlow() {
  let user = await getUser(1);
  if (user.name) {
    let posts = await getPosts(user.id);
    for (let post of posts) {
      console.log("we post", post.id);
    }
  }
}

// Top-level await we can in modules
// await getUser(1);

// async with arrow we use
const arrowAsync = async (id) => {
  let u = await getUser(id);
  return u;
};

// Returning in async chain we do
async function finalValue() {
  let user = await getUser(1);
  return user; // we returns Promise that resolves to user
}
finalValue().then(u => console.log("we final", u));

// Promise combinators with await we use
async function combinators() {
  let first = await Promise.race([getUser(1), getPosts(1)]);
  console.log("we race", first);

  let all = await Promise.allSettled([getUser(1), mayFail(true)]);
  console.log("we allSettled", all);
}
combinators();