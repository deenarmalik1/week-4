// ===== Callback - basic we used =====
function fetchData(callback) {
  setTimeout(() => {
    callback(null, "we got data");
  }, 1000);
}
fetchData((err, data) => {
  if (err) console.log("we error");
  else console.log(data);
});

// ===== Callback Hell - Pyramid of Doom we faced =====
function getUser(userId, callback) {
  setTimeout(() => callback(null, { id: userId, name: "we user" }), 500);
}
function getPosts(userId, callback) {
  setTimeout(() => callback(null, [{ id: 101, title: "we post" }]), 500);
}
function getComments(postId, callback) {
  setTimeout(() => callback(null, [{ id: 201, text: "we comment" }]), 500);
}
function getAuthor(commentId, callback) {
  setTimeout(() => callback(null, { name: "we author" }), 500);
}

// Nested - we lose readability
getUser(1, (err, user) => {
  if (err) return console.log("we error in user");
  console.log("we got user", user);
  getPosts(user.id, (err, posts) => {
    if (err) return console.log("we error in posts");
    console.log("we got posts", posts);
    getComments(posts[0].id, (err, comments) => {
      if (err) return console.log("we error in comments");
      console.log("we got comments", comments);
      getAuthor(comments[0].id, (err, author) => {
        if (err) return console.log("we error in author");
        console.log("we got author", author);
        // we keep nesting deeper -> pyramid
      });
    });
  });
});

// ===== Error handling hell we faced =====
setTimeout(() => {
  try {
    // we try to handle but async error not caught
    getUser(1, (err, user) => {
      if (err) console.log("we need check err every time");
      // if we forget err check -> silent fail
    });
  } catch (e) {
    console.log("we never catch async error here");
  }
});

// ===== Inversion of Control - we trust others =====
function thirdPartyFunction(callback) {
  // we give control - what if it calls twice?
  callback("we first call");
  callback("we second call - we didn't expect");
  // or what if it never calls?
}

thirdPartyFunction((data) => {
  console.log("we got", data, "- called how many times? we don't control");
});

// ===== Parallel hell - we manually manage =====
let results = [];
let completed = 0;
getUser(1, (err, user) => {
  results[0] = user;
  completed++;
  if (completed === 2) console.log("we both done", results);
});
getPosts(1, (err, posts) => {
  results[1] = posts;
  completed++;
  if (completed === 2) console.log("we both done", results);
});
// we manually count - messy for us

// ===== Trying to fix by named functions - still fragmented =====
function handleAuthor(err, author) {
  if (err) return console.log("we error");
  console.log("we final author", author);
}
function handleComments(err, comments) {
  if (err) return console.log("we error");
  getAuthor(comments[0].id, handleAuthor);
}
function handlePosts(err, posts) {
  if (err) return console.log("we error");
  getComments(posts[0].id, handleComments);
}
function handleUser(err, user) {
  if (err) return console.log("we error");
  getPosts(user.id, handlePosts);
}
getUser(1, handleUser); // we reduced nesting but flow scattered

// ===== What Promise solved for us - flat chain =====
// Callback hell above becomes:
Promise.resolve(1)
  .then(id => new Promise(res => getUser(id, (e, u) => res(u))))
  .then(user => new Promise(res => getPosts(user.id, (e, p) => res(p))))
  .then(posts => new Promise(res => getComments(posts[0].id, (e, c) => res(c))))
  .then(comments => new Promise(res => getAuthor(comments[0].id, (e, a) => res(a))))
  .then(author => console.log("we clean chain", author))
  .catch(err => console.log("we one catch for all"));

// Modern async/await - how we want to read
async function cleanFlow() {
  try {
    let user = await new Promise(res => getUser(1, (e, u) => res(u)));
    let posts = await new Promise(res => getPosts(user.id, (e, p) => res(p)));
    let comments = await new Promise(res => getComments(posts[0].id, (e, c) => res(c)));
    let author = await new Promise(res => getAuthor(comments[0].id, (e, a) => res(a)));
    console.log("we linear like sync", author);
  } catch (err) {
    console.log("we one try/catch");
  }
}
cleanFlow();