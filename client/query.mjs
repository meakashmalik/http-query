/**
 * QUERY vs GET vs POST — server pehle chalao: node server/index.js
 */
const BASE = "http://127.0.0.1:3008";

async function dump(title, res) {
  const text = await res.text();
  console.log("\n==== " + title + " ====");
  console.log(res.status, res.statusText);
  console.log("Allow:", res.headers.get("allow"));
  console.log("Accept-Query:", res.headers.get("accept-query"));
  console.log("Content-Location:", res.headers.get("content-location"));
  console.log("Location:", res.headers.get("location"));
  console.log(text);
}

const opt = await fetch(BASE + "/users", { method: "OPTIONS" });
await dump("OPTIONS — QUERY support?", opt);

const get = await fetch(BASE + "/users");
await dump("GET /users — poori list", get);

const query = await fetch(BASE + "/users", {
  method: "QUERY",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify({ gender: "male", minSalary: 12000, limit: 5 }),
});
await dump("QUERY — filter, koi insert nahi", query);

const loc = query.headers.get("location");
if (loc) {
  const rerun = await fetch(BASE + loc);
  await dump("GET Location — same query, latest data", rerun);
}

const badType = await fetch(BASE + "/users", {
  method: "QUERY",
  headers: { "Content-Type": "text/plain" },
  body: "gender=male",
});
await dump("QUERY galat Content-Type → 415", badType);

const unprocessable = await fetch(BASE + "/users", {
  method: "QUERY",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ minSalary: "nahi-number" }),
});
await dump("QUERY galat field → 422", unprocessable);

const post = await fetch(BASE + "/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "rohan", gender: "male", salary: 22000, country: 1 }),
});
await dump("POST — yeh DATA BADALTA hai", post);
