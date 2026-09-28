# HTTP QUERY Method (RFC 10008)

IETF ne June 2026 me **HTTP QUERY** ko standard banaya ([RFC 10008](https://www.rfc-editor.org/rfc/rfc10008.html)).  
Yeh `GET` jaisa **safe + idempotent** hai, lekin query **body** me jaati hai — `POST` jaisa, bina data badle.

## Kaise padhein

1. [NOTES.md](NOTES.md) — kya, kyun, GET vs POST vs QUERY  
2. [INTERVIEW.md](INTERVIEW.md) — short Q&A  
3. Server chalao, phir client / curl se try karo  

## Run

```powershell
cd D:\sqlnotes\Query
node server/index.js
```

Browser: [http://localhost:3008](http://localhost:3008)  
Doosre terminal me:

```powershell
cd D:\sqlnotes\Query
node client/query.mjs
```

`curl` examples: [client/curl.md](client/curl.md)

## Files

| File | Kya hai |
|------|---------|
| [NOTES.md](NOTES.md) | Poora lesson |
| [INTERVIEW.md](INTERVIEW.md) | Interview answers |
| [server/index.js](server/index.js) | Demo API — QUERY / GET / POST / OPTIONS |
| [client/query.mjs](client/query.mjs) | Node client |
| [client/csharp/QueryDemo.cs](client/csharp/QueryDemo.cs) | C# `HttpClient` |
| [client/curl.md](client/curl.md) | curl commands |

```mermaid
flowchart LR
    C[Client] -->|QUERY + JSON body| S[/users]
    S --> R[Filter result — data nahi badla]
```
