//  Implement small module with import/export syntax:-

// --- utils.js ---
export const API_URL = "we https://api.example.com";
export function formatUser(name) { return `we User: ${name.toUpperCase()}`; }
export function debounce(fn, d) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), d); };
}
export default function logger(msg) { console.log(`we [LOG] ${msg}`); }

// --- api.js ---
import { API_URL } from "./utils.js";
export async function getUsers() {
  // we simulate fetch
  return new Promise(res => setTimeout(() => res(["we Ram", "we Sam"]), 500));
}
export { API_URL as URL }; // we re-export

// --- main.js ---
import logger, { formatUser, debounce, API_URL } from "./utils.js";
import { getUsers } from "./api.js";
import * as Utils from "./utils.js"; // namespace

logger("we app start");
console.log(API_URL);
console.log(formatUser("arjun"));

let users = await getUsers(); // we top-level await in module
console.log("we users", users);

// Barrel file - index.js
// export * from "./utils.js";
// export * from "./api.js";
// Then in app: import { getUsers, formatUser } from "./index.js"

// HTML: <script type="module" src="./main.js"></script>