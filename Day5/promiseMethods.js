// ===== Helpers we use =====
function resolveAfter(value, ms) {
  return new Promise(res => setTimeout(() => res(value), ms));
}
function rejectAfter(reason, ms) {
  return new Promise((_, rej) => setTimeout(() => rej(reason), ms));
}

// ===== 1. Promise.all() - we need all succeed =====
let userP = resolveAfter("we user", 300);
let postsP = resolveAfter("we posts", 500);
let commentsP = resolveAfter("we comments", 400);

Promise.all([userP, postsP, commentsP])
  .then(([user, posts, comments]) => {
    console.log("we all fulfilled", user, posts, comments); // we order same as input
  })
  .catch(err => console.log("we all failed", err));

// Fail-fast we see
let good = resolveAfter("we good", 200);
let bad = rejectAfter("we bad error", 300);
let good2 = resolveAfter("we good2", 100);

Promise.all([good, bad, good2])
  .then(vals => console.log("we never here"))
  .catch(err => console.log("we all fails fast on one", err)); // we after 300ms, ignores good2 success

// Real use: we need all data before render
function getUser(id) { return resolveAfter({ id }, 300); }
function getPosts(id) { return resolveAfter([{ postId: 1 }], 400); }

Promise.all([getUser(1), getPosts(1)])
  .then(([user, posts]) => console.log("we render with both", user, posts));

// Parallel faster we prove
console.time("we all parallel");
Promise.all([resolveAfter(1, 500), resolveAfter(2, 500), resolveAfter(3, 500)])
  .then(() => console.timeEnd("we all parallel")); // we ~500ms not 1500ms

// ===== 2. Promise.race() - we need first settled =====
Promise.race([
  resolveAfter("we fast 100ms", 100),
  resolveAfter("we slow 500ms", 500),
  resolveAfter("we slowest 800ms", 800)
]).then(winner => console.log("we race winner", winner)); // we fast 100ms

// Race can reject if fastest rejects - we risk
Promise.race([
  rejectAfter("we fail fast", 100),
  resolveAfter("we success slow", 500)
])
  .then(v => console.log(v))
  .catch(err => console.log("we race rejected because fastest rejected", err));

// Real use: we timeout pattern
function fetchWithTimeout(url, timeoutMs) {
  let fetchP = resolveAfter(`we data from ${url}`, 1000); // we fake fetch
  let timeoutP = rejectAfter("we timeout error", timeoutMs);
  return Promise.race([fetchP, timeoutP]);
}

fetchWithTimeout("/api/user", 500)
  .then(data => console.log("we got", data))
  .catch(err => console.log("we timeout case", err)); // we timeout 500 < fetch 1000

fetchWithTimeout("/api/user", 1500)
  .then(data => console.log("we success before timeout", data));

// Multiple CDN we race
let cdn1 = resolveAfter("we cdn1 data", 300);
let cdn2 = resolveAfter("we cdn2 data", 100);
Promise.race([cdn1, cdn2]).then(data => console.log("we use fastest CDN", data));

// ===== 3. Promise.any() - we need first success =====
Promise.any([
  rejectAfter("we fail1", 100),
  rejectAfter("we fail2", 200),
  resolveAfter("we first success", 300),
  resolveAfter("we second success", 400)
])
  .then(val => console.log("we any winner first fulfilled", val)) // we first success at 300ms
  .catch(err => console.log(err));

// Any ignores rejections unlike race
Promise.any([
  rejectAfter("we fast fail", 100),
  resolveAfter("we slow success", 200)
])
  .then(v => console.log("we any ignores fast fail", v)); // we succeeds vs race would fail

// All fail case - we get AggregateError
Promise.any([
  rejectAfter("we err1", 100),
  rejectAfter("we err2", 200),
  rejectAfter("we err3", 300)
])
  .then(v => console.log("never"))
  .catch(err => {
    console.log("we any all failed", err.name); // we AggregateError
    console.log("we errors array", err.errors); // ["we err1", "we err2", "we err3"]
  });

// Real use: we fallback APIs
function primaryAPI() { return rejectAfter("we primary down", 100); }
function secondaryAPI() { return resolveAfter("we secondary data", 200); }
function cacheAPI() { return resolveAfter("we cache data", 50); }

Promise.any([primaryAPI(), secondaryAPI(), cacheAPI()])
  .then(data => console.log("we use first working source", data)); // we cache data 50ms

// ===== all vs race vs any side by side we compare =====
let p1 = rejectAfter("we p1 fail", 100);
let p2 = resolveAfter("we p2 success", 200);
let p3 = resolveAfter("we p3 success", 300);

Promise.all([p1, p2, p3]).catch(e => console.log("we all -> reject because p1 fail", e));
Promise.race([p1, p2, p3]).catch(e => console.log("we race -> reject because p1 settles first and rejects", e));
Promise.any([p1, p2, p3]).then(v => console.log("we any -> success with p2, ignores p1 fail", v));

// ===== Bonus: allSettled we also use =====
Promise.allSettled([resolveAfter("we ok", 100), rejectAfter("we fail", 200)])
  .then(results => {
    console.log("we allSettled never rejects");
    // results = [{status:"fulfilled", value:"we ok"}, {status:"rejected", reason:"we fail"}]
    console.log(results);
    let fulfilled = results.filter(r => r.status === "fulfilled").map(r => r.value);
    console.log("we filtered success", fulfilled);
  });