# HTTP QUERY — Interview Q&A

Spec: RFC 10008 (June 2026). Lesson: [NOTES.md](NOTES.md)

---

## QUERY kya hai?

HTTP method jo target resource se **safe, idempotent query** chalwata hai. Query **request body** me hoti hai, result response me.

GET = “yeh URI ka representation do.”  
QUERY = “is collection par yeh body-wali query chalao.”

---

## Kyun naya method? GET / POST se kya problem thi?

**GET:** filter URL me — length limit, encoding, logs/bookmarks me leak.  
**POST:** body OK, lekin safe/idempotent nahi — retry se side-effect ho sakta hai, cache mushkil.

QUERY = POST jaisi body + GET jaise safety rules.

---

## Safe aur idempotent ka matlab?

**Safe:** client resource ki state change **expect nahi** karta (sirf padhna).  
**Idempotent:** same request N baar = extra write nahi. Connection fail → retry OK.

Server extra URI (`Location`) bana sakta hai — woh QUERY ko “unsafe” nahi banata.

---

## GET vs QUERY vs POST

| | GET | QUERY | POST |
|--|-----|--------|------|
| Safe | yes | yes | often no |
| Idempotent | yes | yes | often no |
| Typical body | nahi | query JSON/SQL/form | create / action |
| Cache key | URI | URI + body | limited |

---

## Content-Type kyun mandatory?

RFC: missing ya body se mismatch → **reject**. Server type **sniff nahi** karega.

- no type → `400`  
- type support nahi → `415` + `Accept-Query`  
- JSON theek, query logic galat → `422`

---

## Accept-Query kya hai?

Response header: is resource par QUERY body ke **allowed media types**.

```http
Accept-Query: application/json
Allow: GET, QUERY, OPTIONS, HEAD
```

`OPTIONS` se pata chalta hai.

---

## Location vs Content-Location?

`Content-Location` → is run ka **saved result** (`GET` = wahi snapshot).  
`Location` → **equivalent query** (`GET` = query dubara, naya data ho sakta).

Dono optional. Secrets in URLs me nahi.

---

## QUERY cacheable hai?

Haan. Cache **poori body** padhe bina key nahi bana sakta — GET se complex.  
Baad me `Location` pe `GET` switch karo to normal GET cache.

---

## Redirect?

`301/302/307/308`: client **phir QUERY** same body ke saath. POST→GET exception apply nahi.  
`303`: `GET Location`.

---

## Browser / CORS?

Form `method="QUERY"` nahi. `fetch({ method: "QUERY" })` se.  
CORS safelist me nahi → cross-origin pe **OPTIONS preflight**.

---

## Kab use?

Badi structured search, SQL/JSONPath, sensitive filter jo URL me nahi chahiye, retry-safe read.

Chhoti public filter + shareable link → **GET**.  
Write → **POST/PUT/PATCH/DELETE**.

---

## Example (yaad rakhne layak)

```http
QUERY /users HTTP/1.1
Content-Type: application/json

{"gender":"male","minSalary":12000}
```

```javascript
await fetch("/users", {
  method: "QUERY",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ gender: "male" }),
});
```
