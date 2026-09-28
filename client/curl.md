# curl — HTTP QUERY

Server: `node server/index.js` (port 3008)

Windows CMD me `^` se line continue. Git Bash / PowerShell me neeche wale theek hain.

## OPTIONS

```bash
curl -i -X OPTIONS http://127.0.0.1:3008/users
```

Dekho: `Allow`, `Accept-Query: application/json`

## GET (poori list)

```bash
curl -i http://127.0.0.1:3008/users
```

## QUERY (filter body me — data nahi badlega)

```bash
curl -i -X QUERY http://127.0.0.1:3008/users ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"gender\":\"male\",\"minSalary\":12000,\"limit\":5}"
```

Git Bash:

```bash
curl -i -X QUERY http://127.0.0.1:3008/users \
  -H "Content-Type: application/json" \
  -d '{"gender":"male","minSalary":12000,"limit":5}'
```

Response headers: `Content-Location`, `Location` — unpe `GET` try karo.

## 415 — galat type

```bash
curl -i -X QUERY http://127.0.0.1:3008/users -H "Content-Type: text/plain" -d "hi"
```

## POST (state change — contrast)

```bash
curl -i -X POST http://127.0.0.1:3008/users \
  -H "Content-Type: application/json" \
  -d '{"name":"rohan","gender":"male","salary":22000,"country":1}'
```
