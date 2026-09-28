/**
 * HTTP QUERY demo — RFC 10008
 * Run: node server/index.js
 * Open: http://localhost:3008
 */
import http from "node:http";
import { users, applyQuery } from "./data.js";

const PORT = 3008;
const ALLOW = "GET, HEAD, POST, QUERY, OPTIONS";
const ACCEPT_QUERY = "application/json";

let nextUid = 11;
const storedResults = new Map();
const storedQueries = new Map();
let nextResultId = 1;
let nextQueryId = 1;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": ALLOW,
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  Allow: ALLOW,
  "Accept-Query": ACCEPT_QUERY,
};

function send(res, status, body, extra = {}) {
  const payload = body === null ? "" : JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "Content-Type": body === null ? "text/plain" : "application/json; charset=utf-8",
    ...cors,
    ...extra,
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function parseJsonQuery(raw, contentType) {
  if (!contentType) {
    return { error: { status: 400, message: "Content-Type missing. QUERY me type zaroori hai (no sniffing)." } };
  }
  const type = contentType.split(";")[0].trim().toLowerCase();
  if (type !== "application/json") {
    return {
      error: {
        status: 415,
        message: `Yeh resource sirf application/json query leta hai. Aapne bheja: ${type}`,
      },
    };
  }
  if (!raw.trim()) {
    return { error: { status: 400, message: "QUERY body khali hai." } };
  }
  let q;
  try {
    q = JSON.parse(raw);
  } catch {
    return { error: { status: 400, message: "Content-Type application/json hai lekin body valid JSON nahi." } };
  }
  if (q.minSalary !== undefined && q.minSalary !== null && Number.isNaN(Number(q.minSalary))) {
    return { error: { status: 422, message: "minSalary number hona chahiye." } };
  }
  if (q.maxSalary !== undefined && q.maxSalary !== null && Number.isNaN(Number(q.maxSalary))) {
    return { error: { status: 422, message: "maxSalary number hona chahiye." } };
  }
  return { query: q };
}

function homePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>HTTP QUERY demo</title>
<style>
  body { font-family: Segoe UI, sans-serif; max-width: 720px; margin: 2rem auto; line-height: 1.5; }
  code, pre { background: #f4f4f4; padding: 2px 6px; }
  pre { padding: 12px; overflow: auto; }
</style></head>
<body>
<h1>HTTP QUERY — live demo</h1>
<p>RFC 10008. Server port ${PORT}. Notes: <code>Query/NOTES.md</code></p>
<p><button id="btn">QUERY males, salary &ge; 12000</button></p>
<pre id="out">click button…</pre>
<script>
document.getElementById("btn").onclick = async () => {
  const res = await fetch("/users", {
    method: "QUERY",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ gender: "male", minSalary: 12000, limit: 10 })
  });
  const text = await res.text();
  document.getElementById("out").textContent =
    res.status + "\\nContent-Location: " + res.headers.get("Content-Location") +
    "\\nLocation: " + res.headers.get("Location") + "\\n\\n" + text;
};
</script>
</body></html>`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const path = url.pathname;
  const method = req.method.toUpperCase();

  if (method === "OPTIONS") {
    res.writeHead(204, cors);
    res.end();
    return;
  }

  if (path === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", ...cors });
    res.end(homePage());
    return;
  }

  const resultMatch = path.match(/^\/users\/results\/(\d+)$/);
  if (resultMatch && method === "GET") {
    const row = storedResults.get(resultMatch[1]);
    if (!row) return send(res, 404, { error: "stored result nahi mila" });
    return send(res, 200, row);
  }

  const queryMatch = path.match(/^\/users\/queries\/(\d+)$/);
  if (queryMatch && method === "GET") {
    const q = storedQueries.get(queryMatch[1]);
    if (!q) return send(res, 404, { error: "stored query nahi mili" });
    return send(res, 200, applyQuery(users, q));
  }

  if (path !== "/users") {
    return send(res, 404, { error: "path nahi mila. Use GET|QUERY|POST /users" });
  }

  if (method === "GET" || method === "HEAD") {
    if (method === "HEAD") {
      res.writeHead(200, { "Content-Type": "application/json", ...cors });
      res.end();
      return;
    }
    return send(res, 200, users);
  }

  if (method === "POST") {
    const raw = await readBody(req);
    let body;
    try {
      body = JSON.parse(raw || "{}");
    } catch {
      return send(res, 400, { error: "JSON chahiye" });
    }
    const row = {
      uid: nextUid++,
      name: body.name || "unknown",
      gender: body.gender || "male",
      salary: Number(body.salary) || 0,
      dob: body.dob || "2000-01-01",
      country: Number(body.country) || 1,
    };
    users.push(row);
    return send(res, 201, { message: "POST ne data BADLA — naya user add.", user: row });
  }

  if (method === "QUERY") {
    const raw = await readBody(req);
    const parsed = parseJsonQuery(raw, req.headers["content-type"]);
    if (parsed.error) return send(res, parsed.error.status, { error: parsed.error.message });

    const result = applyQuery(users, parsed.query);
    const rid = String(nextResultId++);
    const qid = String(nextQueryId++);
    storedResults.set(rid, result);
    storedQueries.set(qid, parsed.query);

    return send(res, 200, result, {
      "Content-Location": `/users/results/${rid}`,
      Location: `/users/queries/${qid}`,
    });
  }

  send(res, 405, { error: "Method allowed nahi", allow: ALLOW });
});

server.listen(PORT, () => {
  console.log(`HTTP QUERY demo  http://localhost:${PORT}`);
  console.log("GET    /users           saari rows");
  console.log("QUERY  /users           JSON filter, data same");
  console.log("POST   /users           naya user (state change)");
  console.log("OPTIONS /users          Allow + Accept-Query");
});
