//  Use Promises to simulate data fetching and handle errors:-

function fetchData(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error("we fetch failed"));
      else resolve({ id: 1, name: "we data" });
    }, 1000);
  });
}

// Promise chain + error handling
fetchData(false)
  .then(data => {
    console.log("we got", data);
    return fetchData(true); // we chain second call
  })
  .then(data => console.log(data))
  .catch(err => console.log("we catch error", err.message))
  .finally(() => console.log("we finally done"));

// async/await version
async function load() {
  try {
    let data1 = await fetchData(false);
    console.log("we await", data1);
    let data2 = await fetchData(true);
  } catch (e) {
    console.log("we async catch", e.message);
  }
}
load();

// Promise.all for parallel
Promise.all([fetchData(false), fetchData(false)])
  .then(([d1, d2]) => console.log("we all data", d1, d2));