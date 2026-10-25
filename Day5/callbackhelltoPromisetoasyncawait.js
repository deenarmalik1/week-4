// Here is example code explaining callback hell to promises to async/await

// ===== SETUP - callback APIs we start with ====

function getUserCb(id, cb) {
  setTimeout(() => {
    if (!id) cb("we invalid id", null);
    else cb(null, { id, name: "we user" });
  }, 300);
}
function getPostsCb(userId, cb) {
  setTimeout(() => cb(null, [{ id: 101, userId, title: "we post" }]), 300);
}
function getCommentsCb(postId, cb) {
  setTimeout(() => cb(null, [{ id: 201, postId, text: "we comment" }]), 300);
}
function getAuthorCb(commentId, cb) {
  setTimeout(() => cb(null, { name: "we author" }), 300);
}

// ===== 1. CALLBACK HELL - pyramid we suffered =====
getUserCb(1, (err, user) => {
  if (err) return console.log("we err user", err);
  console.log("we user", user);
  getPostsCb(user.id, (err, posts) => {
    if (err) return console.log("we err posts", err);
    console.log("we posts", posts);
    getCommentsCb(posts[0].id, (err, comments) => {
      if (err) return console.log("we err comments", err);
      console.log("we comments", comments);
      getAuthorCb(comments[0].id, (err, author) => {
        if (err) return console.log("we err author", err);
        console.log("we author", author);
        console.log("we final done but nested hell");
      });
    });
  });
});

// ===== 2. PROMISE WRAPPER - we promisify callback =====
function getUserP(id) {
  return new Promise((resolve, reject) => {
    getUserCb(id, (err, user) => err ? reject(err) : resolve(user));
  });
}
function getPostsP(userId) {
  return new Promise((res, rej) => {
    getPostsCb(userId, (err, posts) => err ? rej(err) : res(posts));
  });
}
function getCommentsP(postId) {
  return new Promise((res, rej) => {
    getCommentsCb(postId, (err, c) => err ? rej(err) : res(c));
  });
}
function getAuthorP(commentId) {
  return new Promise((res, rej) => {
    getAuthorCb(commentId, (err, a) => err ? rej(err) : res(a));
  });
}

// ===== 3. PROMISES - chain we improved to =====
getUserP(1)
  .then(user => {
    console.log("we promise user", user);
    return getPostsP(user.id); // we return promise
  })
  .then(posts => {
    console.log("we promise posts", posts);
    return getCommentsP(posts[0].id);
  })
  .then(comments => {
    console.log("we promise comments", comments);
    return getAuthorP(comments[0].id);
  })
  .then(author => {
    console.log("we promise author", author);
    console.log("we promise chain flat - no pyramid");
  })
  .catch(err => console.log("we one catch for all steps", err))
  .finally(() => console.log("we promise finally"));

// Transform chain we do
Promise.resolve(1)
  .then(id => getUserP(id))
  .then(user => user.id)
  .then(id => getPostsP(id))
  .then(posts => posts[0].id)
  .then(id => getCommentsP(id))
  .then(comments => comments[0].id)
  .then(id => getAuthorP(id))
  .then(author => console.log("we transformed chain", author));

// Parallel with promises we improved
Promise.all([getUserP(1), getPostsP(1), getCommentsP(101)])
  .then(([user, posts, comments]) => {
    console.log("we all parallel with promises", user, posts, comments);
  });

// ===== 4. ASYNC/AWAIT - linear we love now =====
async function flowAsync() {
  try {
    console.log("we async start");
    let user = await getUserP(1); // we pause but not block thread
    console.log("we async user", user);

    let posts = await getPostsP(user.id);
    console.log("we async posts", posts);

    let comments = await getCommentsP(posts[0].id);
    console.log("we async comments", comments);

    let author = await getAuthorP(comments[0].id);
    console.log("we async author", author);

    console.log("we async final linear like sync");
    return author;
  } catch (err) {
    console.log("we async one try/catch for all", err);
  } finally {
    console.log("we async finally");
  }
}
flowAsync().then(author => console.log("we async returned", author));

// Sequential vs Parallel we must know
async function sequentialSlow() {
  console.time("we sequential 900ms");
  let u = await getUserP(1); // we wait 300
  let p = await getPostsP(1); // we wait 300 after
  let c = await getCommentsP(101); // we wait 300 after -> total 900
  console.timeEnd("we sequential 900ms");
}

async function parallelFast() {
  console.time("we parallel 300ms");
  let uPromise = getUserP(1); // we start all now
  let pPromise = getPostsP(1);
  let cPromise = getCommentsP(101);
  let [u, p, c] = await Promise.all([uPromise, pPromise, cPromise]); // we wait together ~300
  console.timeEnd("we parallel 300ms");
}

async function mixedBest() {
  // we dependent + independent mix we do in real
  let user = await getUserP(1); // we need user first
  // now posts and comments can run parallel if independent
  let [posts, comments] = await Promise.all([
    getPostsP(user.id),
    getCommentsP(101)
  ]);
  let author = await getAuthorP(comments[0].id);
  console.log("we mixed optimal", author);
}

// Loops we fixed from hell
async function callbackLoopHell() {
  // Old callback loop hell we had
  let ids = [1, 2, 3];
  let results = [];
  let done = 0;
  ids.forEach(id => {
    getUserCb(id, (err, user) => {
      results.push(user);
      done++;
      if (done === ids.length) console.log("we callback loop done", results);
    });
  });
}
callbackLoopHell();

async function asyncLoopClean() {
  // New async loop we do
  let ids = [1, 2, 3];
  // Parallel - best
  let users = await Promise.all(ids.map(id => getUserP(id)));
  console.log("we async loop parallel", users);
  
  // Sequential if we need order/rate limit
  for (let id of ids) {
    let user = await getUserP(id);
    console.log("we async for loop", user);
  }
}
asyncLoopClean();

// ===== EVOLUTION COMPARISON SIDE BY SIDE =====
// Same task: getUser(1) -> getPosts -> getComments -> getAuthor

// 1. CALLBACKS: we 4 levels nested, 4 err checks, pyramid
// getUserCb(1, (e,u) => { if(e) return; getPostsCb(u.id, (e,p) => { if(e) return; getCommentsCb(p[0].id, (e,c) => { if(e) return; getAuthorCb(c[0].id, (e,a) => console.log(a)) }) }) })

// 2. PROMISES: we flat chain, 1 catch, linear vertical
// getUserP(1).then(u => getPostsP(u.id)).then(p => getCommentsP(p[0].id)).then(c => getAuthorP(c[0].id)).then(a => console.log(a)).catch(e => console.log(e))

// 3. ASYNC/AWAIT: we sync-like, try/catch, most readable
// (async () => { try { let u = await getUserP(1); let p = await getPostsP(u.id); let c = await getCommentsP(p[0].id); let a = await getAuthorP(c[0].id); console.log(a) } catch(e){ console.log(e) } })()

// ===== REAL WORLD FETCH EXAMPLE we all face =====
// Callback style fetch (old)
function fetchJsonCb(url, cb) {
  setTimeout(() => cb(null, { data: "we data from " + url }), 200);
}
fetchJsonCb("/user", (e, userRes) => {
  fetchJsonCb(`/posts?user=${userRes.data}`, (e, postsRes) => {
    console.log("we callback fetch", postsRes);
  });
});

// Promise style fetch (fetch API returns promise)
function fetchJsonP(url) {
  return new Promise(res => setTimeout(() => res({ data: "we data from " + url }), 200));
}
fetchJsonP("/user")
  .then(userRes => fetchJsonP(`/posts?user=${userRes.data}`))
  .then(postsRes => console.log("we promise fetch", postsRes));

// Async/await fetch (modern we use daily)
async function fetchJsonAsync() {
  let userRes = await fetchJsonP("/user");
  let postsRes = await fetchJsonP(`/posts?user=${userRes.data}`);
  console.log("we async fetch", postsRes);
}
fetchJsonAsync();