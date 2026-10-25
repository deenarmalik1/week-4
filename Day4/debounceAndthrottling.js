// ===== DEBOUNCE - we wait for silence =====
function debounce(func, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId); // we cancel previous timer
    timerId = setTimeout(() => {
      func.apply(this, args); // we run after quiet period
    }, delay);
  };
}

// Our use case: search input
let searchInput = document.querySelector("#search");

function fetchSearch(query) {
  console.log("we API call for", query);
  fetch(`/api/search?q=${query}`);
}

let debouncedSearch = debounce(fetchSearch, 500);

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e.target.value); // we call but it will wait till we stop typing 500ms
});

// Another: we resize
function handleResize() {
  console.log("we final window size", window.innerWidth);
}
window.addEventListener("resize", debounce(handleResize, 300));

// Debounce with leading + trailing options we use
function debounceAdvanced(func, delay, options = { leading: false, trailing: true }) {
  let timerId;
  let lastArgs;
  return function (...args) {
    lastArgs = args;
    if (!timerId && options.leading) {
      func.apply(this, args); // we run immediately first time
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      if (options.trailing) {
        func.apply(this, lastArgs); // we run after pause
      }
    }, delay);
  };
}

// ===== THROTTLING - we limit frequency =====
function throttle(func, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args); // we run immediately
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false; // we allow next run after limit
      }, limit);
    }
    // we ignore calls during throttle period
  };
}

// Throttle with leading + trailing - better version we use
function throttleAdvanced(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func.apply(this, args); // we run first time
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args); // we run after limit
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Our use cases: scroll, mousemove
function onScroll() {
  console.log("we scroll pos", window.scrollY);
}
window.addEventListener("scroll", throttle(onScroll, 200)); // we at most once per 200ms

function onMouseMove(e) {
  console.log("we mouse", e.clientX, e.clientY);
}
window.addEventListener("mousemove", throttleAdvanced(onMouseMove, 100));

// Button spam prevention we do
let btn = document.querySelector("#submit");
function submitForm() {
  console.log("we submit - only once per 2s allowed");
}
btn.addEventListener("click", throttle(submitForm, 2000));

// ===== Difference we see =====
// Debounce test we simulate
let debouncedLog = debounce(() => console.log("we debounced - runs after stop"), 500);
// If we call 5 times quickly, we run only once after 500ms quiet
debouncedLog();
debouncedLog();
debouncedLog();
debouncedLog();
debouncedLog();

// Throttle test we simulate
let throttledLog = throttle(() => console.log("we throttled - runs max once per 500ms"), 500);
// If we call 5 times quickly, we run once immediately, ignore rest till 500ms over
throttledLog();
throttledLog();
throttledLog();
throttledLog();
throttledLog();

// ===== Lodash style we use in real project =====
// _.debounce(fetchSearch, 500)
// _.throttle(onScroll, 200)

// ===== Auto-save draft we implement =====
let editor = document.querySelector("#editor");
let autoSave = debounce(() => {
  console.log("we auto-save after we stopped typing");
  // save to server
}, 1000);
editor.addEventListener("input", autoSave);

// ===== Resize with both we sometimes need =====
let onResizeThrottled = throttle(() => console.log("we resizing - intermediate"), 100);
let onResizeDebounced = debounce(() => console.log("we resize finished - final"), 300);
window.addEventListener("resize", () => {
  onResizeThrottled();
  onResizeDebounced();
});