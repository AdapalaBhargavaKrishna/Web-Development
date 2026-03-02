# 📄 Lesson 11 — Pagination at Scale (Cursor vs Offset)

---

## Two Types of Pagination

| Type | Method | Best For |
|------|--------|---------|
| Offset Pagination | `take` + `skip` | Admin panels, small data, page numbers |
| Cursor Pagination | `take` + `cursor` | Feeds, infinite scroll, large data |

---

## 1️⃣ Offset Pagination

```js
// Page 1
const users = await prisma.user.findMany({ take: 10, skip: 0 })

// Page 2
const users = await prisma.user.findMany({ take: 10, skip: 10 })

// Page 3
const users = await prisma.user.findMany({ take: 10, skip: 20 })

// Formula: skip = (pageNumber - 1) * pageSize
```

### Clean Reusable Function

```js
async function getUsers(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      take: pageSize,
      skip: skip,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ])

  return {
    data: users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNextPage: skip + pageSize < total,
    hasPrevPage: page > 1
  }
}

// Usage
const result = await getUsers(2, 10)
// {
//   data: [...10 users],
//   total: 100,
//   page: 2,
//   totalPages: 10,
//   hasNextPage: true,
//   hasPrevPage: true
// }
```

---

### ❌ Why Offset Breaks at Scale

**Problem 1 — Gets slower the further you go**

```sql
-- What Postgres actually does under the hood
SELECT * FROM users ORDER BY createdAt DESC LIMIT 10 OFFSET 50000
```

Postgres cannot jump to row 50,000. It must:
1. Scan and load all 50,000 rows into memory
2. Throw away the first 49,990
3. Return only the last 10

The bigger the skip, the slower the query. At skip 1,000,000 your app will time out. This is O(n).

**Problem 2 — Data shifts cause duplicate or missing rows**

```
You are on page 3. Someone inserts a new user while you scroll.

Page 1: users 1-10    <- already seen
Page 2: users 11-20   <- already seen
                      <- NEW USER INSERTED HERE (shifts everything down)
Page 3: users 21-30   <- user 21 appears again (was at bottom of page 2 before)
```

This is a real bug in social feeds, dashboards, and any live data app.

---

## 2️⃣ Cursor Pagination — The Scalable Way

Instead of "skip 50,000 rows", you say "give me rows that come AFTER this specific record".

The cursor is the id of the last record you received.

```js
// First page — no cursor yet
const firstPage = await prisma.user.findMany({
  take: 10,
  orderBy: { id: 'asc' }
})

// Grab cursor from last record
const cursor = firstPage[firstPage.length - 1].id  // e.g. id: 10

// Second page — start AFTER the cursor
const secondPage = await prisma.user.findMany({
  take: 10,
  skip: 1,              // skip the cursor record itself
  cursor: { id: cursor },
  orderBy: { id: 'asc' }
})

// Third page — use new cursor from second page
const newCursor = secondPage[secondPage.length - 1].id

const thirdPage = await prisma.user.findMany({
  take: 10,
  skip: 1,
  cursor: { id: newCursor },
  orderBy: { id: 'asc' }
})
```

### Clean Reusable Function

```js
async function getUsersCursor(cursor = null, pageSize = 10) {
  const users = await prisma.user.findMany({
    take: pageSize + 1,    // fetch one extra to check if next page exists
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor }
    }),
    orderBy: { id: 'asc' }
  })

  const hasNextPage = users.length > pageSize

  if (hasNextPage) users.pop()  // remove the extra record

  const nextCursor = hasNextPage ? users[users.length - 1].id : null

  return {
    data: users,
    hasNextPage,
    nextCursor    // send to frontend, use it in the next request
  }
}

// First page
const page1 = await getUsersCursor()
// { data: [...10 users], hasNextPage: true, nextCursor: 10 }

// Second page — pass cursor from previous response
const page2 = await getUsersCursor(page1.nextCursor)
// { data: [...10 users], hasNextPage: true, nextCursor: 20 }

// Keep going until hasNextPage is false
```

---

### Why Cursor is Fast at Scale

```sql
-- What Postgres actually does under the hood
SELECT * FROM users WHERE id > 10 ORDER BY id ASC LIMIT 10
```

Because id is indexed, Postgres jumps directly to id 10 in the B-Tree
and grabs the next 10. No scanning. No throwing away rows.
Always O(log n) no matter how deep you go.

---

### Cursor on Posts with Filter

```js
async function getPostsCursor(cursor = null, pageSize = 10) {
  const posts = await prisma.post.findMany({
    take: pageSize + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor }
    }),
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })

  const hasNextPage = posts.length > pageSize
  if (hasNextPage) posts.pop()

  return {
    data: posts,
    hasNextPage,
    nextCursor: hasNextPage ? posts[posts.length - 1].id : null
  }
}
```

> You can ORDER BY any field like createdAt, but the cursor
> itself must always point to a @id or @unique field.

---

## The take + 1 Trick Explained

```js
take: pageSize + 1   // if pageSize is 10, we fetch 11

// If we get 11 back  there IS a next page
// If we get 10 or less back  we are on the last page

if (users.length > pageSize) {
  hasNextPage = true
  users.pop()   // remove the 11th record, it was just a probe
}
```

This avoids an extra count() query just to check if more pages exist.

---

## Side by Side Comparison

| | Offset Pagination | Cursor Pagination |
|---|---|---|
| **Syntax** | `take` + `skip` | `take` + `cursor` |
| **Speed at page 1** | Fast | Fast |
| **Speed at page 1000** | Very slow | Same speed always |
| **Data shifting bug** | Yes | No |
| **Jump to page 50** | Yes | No |
| **Complexity** | Simple | Slightly more logic |
| **Best for** | Admin panels, small data | Feeds, infinite scroll |
| **Frontend shows** | Page numbers 1, 2, 3 | Load more button |
| **Performance** | O(n) gets worse over time | O(log n) always fast |

---

## When to Use Which

```
Use OFFSET when:
   - Data is small and does not change often
   - User needs to jump to specific page numbers
   - Admin dashboards, reports, search results

Use CURSOR when:
   - Data is large (100k+ rows)
   - Data changes in real time (social feed, notifications)
   - Infinite scroll or Load More button
   - APIs consumed by mobile apps
```

---

## Quick Summary

| Concept | Key Point |
|---------|----------|
| Offset skip | Simple but O(n) — slow at high page numbers |
| Cursor | O(log n) — always fast, uses the B-Tree index |
| `take + 1` trick | Fetch one extra to detect if next page exists |
| `skip: 1` with cursor | Skips the cursor record itself |
| `nextCursor` | Last record's id — send to frontend for next request |
| Cursor field | Must be `@id` or `@unique` — cannot use non-unique fields |
| Data shift bug | Offset has it, Cursor does not |
