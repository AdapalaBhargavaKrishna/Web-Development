# ⚡ Lesson 12 — Database Performance & Query Optimization

---

## Part 1 — The N+1 Problem

### What is N+1?

N+1 means your app makes way more database queries than it should.
1 query to get all records, then N more queries (one per record) to get related data.

```js
// ❌ BAD — N+1 Problem
const users = await prisma.user.findMany()        // 1 query

for (const user of users) {
  const posts = await prisma.post.findMany({      // 1 query PER user!
    where: { authorId: user.id }
  })
  console.log(user.name, posts)
}

// With 100 users = 101 queries
// With 1000 users = 1001 queries
```

```js
// ✅ GOOD — Use include, Prisma batches into one IN query
const users = await prisma.user.findMany({
  include: { posts: true }   // 2 queries total no matter how many users
})

for (const user of users) {
  console.log(user.name, user.posts)  // posts already loaded, no extra queries
}
```

### How Prisma's include actually works under the hood

```sql
-- Query 1: fetch all users
SELECT * FROM "User" WHERE 1=1 OFFSET 0

-- Query 2: fetch ALL posts for ALL users in one IN clause
SELECT * FROM "Post" WHERE "authorId" IN (1, 2, 3, 4, ... 44)
```

Prisma never does true N+1 with include.
It always batches related records into a single IN query.
Real N+1 only happens when YOU manually loop and query inside a for loop.

---

### N+1 inside nested relations

```js
// ❌ CATASTROPHIC — N+1 inside N+1
const users = await prisma.user.findMany()              // 1 query

for (const user of users) {
  const posts = await prisma.post.findMany({             // N queries
    where: { authorId: user.id }
  })
  for (const post of posts) {
    const tags = await prisma.tag.findMany({             // N*M queries
      where: { posts: { some: { id: post.id } } }
    })
  }
}
// 100 users x 10 posts each = 1 + 100 + 1000 = 1101 queries

// ✅ FIXED — deeply nested include, still just a few queries
const users = await prisma.user.findMany({
  include: {
    posts: {
      include: { tags: true }
    }
  }
})
```

---

### Use select with include to only fetch needed fields

```js
// ✅ BEST — no N+1 AND only fetches fields you actually use
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    posts: {
      select: {
        id: true,
        title: true,
        tags: { select: { name: true } }
      }
    }
  }
})
```

Less data transferred from DB = faster response time.

---

## Part 2 — Slow Queries and Fixes

### Problem 1 — Fetching too much data

```js
// ❌ BAD — fetches ALL users, could be millions
const users = await prisma.user.findMany()

// ✅ GOOD — always limit
const users = await prisma.user.findMany({
  take: 10,
  orderBy: { createdAt: 'desc' }
})
```

---

### Problem 2 — Fetching columns you don't need

```js
// ❌ BAD — fetches all columns including heavy content field
const posts = await prisma.post.findMany()

// ✅ GOOD — only what the UI needs
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    createdAt: true,
    author: { select: { name: true } }
    // content skipped — could be thousands of characters
  }
})
```

---

### Problem 3 — Missing indexes on filtered fields

```js
// ❌ SLOW — full table scan if status has no index
const posts = await prisma.post.findMany({
  where: { status: 'PUBLISHED' },
  orderBy: { createdAt: 'desc' }
})
```

```prisma
// ✅ FIX — composite index matching the exact query pattern
model Post {
  @@index([status, createdAt])
}
```

---

### Problem 4 — Counting inside a loop

```js
// ❌ BAD — N extra count queries
const users = await prisma.user.findMany()

for (const user of users) {
  const postCount = await prisma.post.count({     // 1 query per user!
    where: { authorId: user.id }
  })
  console.log(user.name, postCount)
}

// ✅ GOOD — _count fetches all counts in the same query
const users = await prisma.user.findMany({
  include: {
    _count: { select: { posts: true } }
  }
})

for (const user of users) {
  console.log(user.name, user._count.posts)  // no extra queries
}
```

---

### Problem 5 — Sequential queries that could run in parallel

```js
// ❌ BAD — total time = 200ms + 150ms + 100ms = 450ms
const users = await prisma.user.findMany()
const posts = await prisma.post.findMany()
const tags  = await prisma.tag.findMany()

// ✅ GOOD — total time = max(200ms, 150ms, 100ms) = 200ms
const [users, posts, tags] = await Promise.all([
  prisma.user.findMany(),
  prisma.post.findMany(),
  prisma.tag.findMany()
])
```

> Use Promise.all when queries are independent of each other.
> Use $transaction when they need to be atomic (all or nothing).

---

## Part 3 — _count Without Extra Queries

```js
// Count one relation
const users = await prisma.user.findMany({
  include: {
    _count: { select: { posts: true } }
  }
})
// user._count.posts = 5

// Count multiple relations at once
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        posts: true,
        profile: true
      }
    }
  }
})

// Count with filter — only count published posts
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        posts: { where: { published: true } }
      }
    }
  }
})
```

---

## Part 4 — Raw SQL When Prisma Is Not Enough

```js
// $queryRaw — for SELECT queries, returns typed results
const users = await prisma.$queryRaw`
  SELECT id, name, email
  FROM "User"
  WHERE age > ${25}
  ORDER BY "createdAt" DESC
  LIMIT 10
`

// $executeRaw — for INSERT, UPDATE, DELETE, returns affected row count
const affected = await prisma.$executeRaw`
  UPDATE "User" SET age = age + 1 WHERE id = ${1}
`
console.log(affected)  // number of rows affected
```

### SQL Injection Safety

```js
// ❌ NEVER — SQL injection vulnerability
const users = await prisma.$queryRawUnsafe(
  `SELECT * FROM "User" WHERE email = '${userInput}'`
)

// ✅ ALWAYS — parameterized, Prisma makes userInput become $1 in SQL
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE email = ${userInput}
`
```

Always use tagged template literals with $queryRaw.
Prisma automatically parameterizes the values for you.

---

## Part 5 — Query Logging to Find Slow Queries

```js
// src/db.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'warn',  emit: 'stdout' },
    { level: 'error', emit: 'stdout' }
  ]
})

prisma.$on('query', (e) => {
  console.log('Query:   ', e.query)
  console.log('Params:  ', e.params)
  console.log('Duration:', e.duration, 'ms')
  console.log('---')
})

module.exports = prisma
```

### Reading the output

```
Query:    SELECT * FROM "User" WHERE 1=1 OFFSET 0
Params:   [0]
Duration: 409 ms    <- high because Supabase free tier cold start

Query:    SELECT * FROM "Post" WHERE "authorId" IN ($1,$2...$44)
Params:   [1,2,3,...44,0]
Duration: 295 ms    <- one batched IN query for all users, not N+1
```

### Duration guide

| Duration | What it means |
|----------|--------------|
| 0 – 50ms | Perfect |
| 50 – 200ms | Acceptable, monitor it |
| 200ms+ | Red flag — missing index or N+1 |
| Same query repeated many times | N+1 problem |

### Supabase free tier cold start

First query always takes 300–500ms because free tier pauses
after inactivity. Second query onwards will be under 50ms.
This is a Supabase infrastructure issue, not a code problem.

---

## Part 6 — include vs select Performance Decision

```js
// include — fetches ALL fields of related model
const users = await prisma.user.findMany({
  include: { posts: true }  // every post field comes back
})

// select — fetches ONLY the fields you specify
const users = await prisma.user.findMany({
  select: {
    name: true,
    posts: { select: { title: true } }  // only title, nothing else
  }
})
```

| Situation | Use |
|-----------|-----|
| List/feed pages | `select` — only need title, date, author name |
| Detail/single record pages | `include` — need all fields |
| API response going to mobile | `select` — reduce payload size |

---

## Quick Summary — All Problems and Fixes

| Problem | Symptom | Fix |
|---------|---------|-----|
| N+1 | Same query repeating N times in logs | Use `include` or `select` with relations |
| Too much data | Slow query, high memory usage | Add `take` to limit records |
| Unused columns | Slow response, wasted bandwidth | Use `select` to pick only needed fields |
| Missing index | Slow filter or sort queries | Add `@@index` on WHERE and ORDER BY fields |
| Count in loop | N extra count queries in logs | Use `_count` inside `include` |
| Sequential queries | Slow total response time | Use `Promise.all` for independent queries |
| Complex query | Prisma query builder not enough | Use `$queryRaw` with template literals |
| Unknown slow query | No visibility | Enable Prisma query logging |

---

## Checklist Before Shipping Any API Endpoint

```
[ ] No manual loops with queries inside — using include or select
[ ] Added take to limit results — never fetching unlimited records
[ ] Only selecting fields the frontend actually needs
[ ] Foreign key fields have @@index in schema
[ ] Independent queries running in parallel with Promise.all
[ ] No count() calls inside loops — using _count instead
[ ] Query logging enabled in dev — no 200ms+ queries
[ ] No $queryRawUnsafe with user input — using tagged template literals
```