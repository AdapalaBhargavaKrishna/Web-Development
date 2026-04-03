# 📘 Prisma ORM with Supabase — Complete Notes (Lessons 1–15)
> Stack: Node.js + Prisma v5 + Supabase PostgreSQL | Folder: `backend/`

---

## 📑 Table of Contents
1. [Setup](#1-setup)
2. [Schema Basics](#2-schema-basics)
3. [CREATE](#3-create)
4. [READ](#4-read)
5. [UPDATE](#5-update)
6. [DELETE](#6-delete)
7. [Relations](#7-relations)
8. [AND OR NOT Filtering](#8-and-or-not-filtering)
9. [Transactions](#9-transactions)
10. [Schema Design & Indexing](#10-schema-design--indexing)
11. [Pagination at Scale](#11-pagination-at-scale)
12. [Performance & N+1](#12-performance--n1)
13. [Soft Deletes & Audit Logs](#13-soft-deletes--audit-logs)
14. [RBAC](#14-rbac)
15. [Real API Structure](#15-real-api-structure)

---

## 1. Setup

```bash
mkdir backend && cd backend
npm init -y
npm install prisma@5 --save-dev
npm install @prisma/client@5 express dotenv
npx prisma init
```

### .env
```env
# Use port 5432 (direct) for CLI — port 6543 (pooler) hangs
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
```

### src/db.js
```js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
module.exports = prisma
// ⚠️ Always ONE instance — multiple instances = too many DB connections
```

### src/index.js
```js
const prisma = require('./db')
async function main() { /* code here */ }
main().catch(console.error).finally(() => prisma.$disconnect())
```

### CLI Commands
| Command | Purpose |
|---------|---------|
| `npx prisma db push` | Push schema to DB |
| `npx prisma generate` | Regenerate client after schema change |
| `npx prisma studio` | Visual DB browser at localhost:5555 |
| `npx prisma migrate dev` | Create migration with history |

---

## 2. Schema Basics

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql" url = env("DATABASE_URL") }

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  age       Int?                    // ? = optional/nullable
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}
```

| Modifier | Meaning |
|----------|---------|
| `@id` | Primary key |
| `@unique` | Unique + auto-indexed |
| `?` | Nullable field |
| `@default(now())` | Auto timestamp on create |
| `@updatedAt` | Auto timestamp on every update |

---

## 3. CREATE

```js
// One record — returns full record
await prisma.user.create({ data: { name: "Alice", email: "alice@gmail.com" } })

// Many records — returns { count } not records
await prisma.user.createMany({
  data: [{ name: "Bob", email: "bob@gmail.com" }, { name: "Charlie", email: "charlie@gmail.com" }]
})

// With select — return only specific fields
await prisma.user.create({
  data: { name: "Eve", email: "eve@gmail.com" },
  select: { id: true, name: true }
})
```

---

## 4. READ

```js
await prisma.user.findMany()                                         // all records
await prisma.user.findUnique({ where: { id: 1 } })                  // by @id or @unique only
await prisma.user.findFirst({ where: { name: "Alice" } })           // first match any field
await prisma.user.findMany({ where: { age: { gt: 20 } } })          // filter
await prisma.user.findMany({ select: { id: true, name: true } })    // specific fields
await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })      // sort
await prisma.user.findMany({ take: 10, skip: 20 })                  // paginate
await prisma.user.count({ where: { age: { gt: 25 } } })             // count
```

### Filter Operators
| Op | Meaning | Op | Meaning |
|----|---------|-----|---------|
| `gt` | greater than | `lt` | less than |
| `gte` | greater than or equal | `lte` | less than or equal |
| `contains` | like %value% | `startsWith` | like value% |
| `not` | not equal | `in` | matches any in array |

---

## 5. UPDATE

```js
// One — returns updated record
await prisma.user.update({ where: { id: 1 }, data: { name: "Updated" } })

// Many — returns { count }
await prisma.user.updateMany({ where: { age: { lt: 25 } }, data: { age: 25 } })

// Numeric shortcuts
await prisma.user.update({ where: { id: 1 }, data: { age: { increment: 1 } } })
// also: decrement, multiply, divide

// Upsert — update if exists, create if not
await prisma.user.upsert({
  where: { email: "alice@gmail.com" },
  update: { name: "Alice Updated" },
  create: { name: "Alice", email: "alice@gmail.com" }
})
```

---

## 6. DELETE

```js
// One — returns deleted record, throws if not found
await prisma.user.delete({ where: { id: 1 } })

// Many — returns { count }, never throws
await prisma.user.deleteMany({ where: { age: { lt: 20 } } })

// ALL records ⚠️ dangerous
await prisma.user.deleteMany()

// Always use try/catch with delete()
try {
  await prisma.user.delete({ where: { id: 999 } })
} catch (e) { console.log("Not found") }
```

---

## 7. Relations

```prisma
// One to Many
model User { posts Post[] }
model Post {
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

// One to One — add @unique on foreign key
model Profile { userId Int @unique; user User @relation(...) }

// Many to Many — Prisma handles join table automatically
model Post { tags Tag[] }
model Tag  { posts Post[] }
```

```js
// Create with nested relation
await prisma.user.create({
  data: { name: "Alice", email: "alice@gmail.com",
    posts: { create: [{ title: "Post 1" }] }
  },
  include: { posts: true }
})

// Connect existing record
await prisma.post.create({ data: { title: "Post", author: { connect: { id: 1 } } } })

// Fetch with relations
await prisma.user.findUnique({ where: { id: 1 }, include: { posts: true } })

// include = all fields | select = pick fields
await prisma.user.findUnique({
  where: { id: 1 },
  select: { name: true, posts: { select: { title: true } } }
})
```

### onDelete Options
| Option | Behavior |
|--------|---------|
| `Cascade` | Delete children when parent deleted |
| `Restrict` | Block parent deletion if children exist |
| `SetNull` | Set FK to null when parent deleted |

---

## 8. AND OR NOT Filtering

```js
// AND (default behavior — same as just stacking where conditions)
await prisma.user.findMany({ where: { AND: [{ age: { gt: 20 } }, { name: { contains: "ali" } }] } })

// OR
await prisma.user.findMany({ where: { OR: [{ age: { lt: 20 } }, { age: { gt: 30 } }] } })

// NOT
await prisma.user.findMany({ where: { NOT: { name: "Alice" } } })

// Relation filters
await prisma.user.findMany({ where: { posts: { some: { published: true } } } }) // at least one
await prisma.user.findMany({ where: { posts: { every: { published: true } } } }) // all
await prisma.user.findMany({ where: { posts: { none: {} } } })                  // none

// Null checks
await prisma.user.findMany({ where: { age: null } })
await prisma.user.findMany({ where: { age: { not: null } } })
```

---

## 9. Transactions

```js
// Array — simple, parallel, atomic
const [u1, u2] = await prisma.$transaction([
  prisma.user.update({ where: { id: 1 }, data: { age: { decrement: 1 } } }),
  prisma.user.update({ where: { id: 2 }, data: { age: { increment: 1 } } })
])

// Interactive — use result of one step in next step
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { name: "Bob", email: "bob@gmail.com" } })
  const post = await tx.post.create({ data: { title: "Post", authorId: user.id } })
  return { user, post }
})
// ⚠️ Use tx not prisma inside — if anything fails, ALL rolls back
```

---

## 10. Schema Design & Indexing

### Design Rules
```prisma
// ❌ Never store multiple values in one field
// ✅ Use separate table for one-to-many data

// Use enum for fixed string values — prevents typos
enum Role { USER ADMIN MODERATOR }
enum PostStatus { DRAFT PUBLISHED ARCHIVED }

// Always define onDelete on every relation
author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
```

### Indexing
```prisma
model Post {
  @@index([authorId])             // always index foreign keys
  @@index([status, createdAt])    // composite — filter + sort together
}
```

### How B-Tree Index Works
Without index → Full Table Scan → O(n) — checks every row
With index → B-Tree binary search → O(log n) — jumps directly to row

| Rows | No Index | With Index |
|------|---------|-----------|
| 1,000 | 1,000 checks | ~10 steps |
| 1,000,000 | 1,000,000 checks | ~20 steps |
| 10,000,000 | 10,000,000 checks | ~23 steps |

Rules: Index fields you filter/sort by. Never index long text. Too many indexes slow writes.
Composite index — most filtered field goes FIRST. Order matters.

---

## 11. Pagination at Scale

### Offset Pagination (simple, breaks at scale)
```js
async function getUsers(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize
  const [users, total] = await Promise.all([
    prisma.user.findMany({ take: pageSize, skip, orderBy: { createdAt: 'desc' } }),
    prisma.user.count()
  ])
  return { data: users, total, page, totalPages: Math.ceil(total / pageSize),
           hasNextPage: skip + pageSize < total }
}
// ❌ OFFSET 50000 = Postgres loads 50000 rows then throws 49990 away — O(n)
// ❌ Data shift bug — new inserts cause duplicate rows across pages
```

### Cursor Pagination (scalable, always fast)
```js
async function getPostsCursor(cursor = null, pageSize = 10) {
  const posts = await prisma.post.findMany({
    take: pageSize + 1,               // fetch one extra to detect next page
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { id: 'asc' }
  })
  const hasNextPage = posts.length > pageSize
  if (hasNextPage) posts.pop()        // remove the probe record
  return { data: posts, hasNextPage, nextCursor: hasNextPage ? posts[posts.length - 1].id : null }
}
// ✅ WHERE id > 10 — uses B-Tree index, always O(log n)
// ✅ No data shift bug
// ❌ Cannot jump to page 50 — only next/prev
```

| | Offset | Cursor |
|--|--------|--------|
| Performance | O(n) — degrades | O(log n) — always fast |
| Data shift bug | Yes | No |
| Jump to page | Yes | No |
| Best for | Admin panels | Feeds, infinite scroll |

---

## 12. Performance & N+1

### N+1 Problem
```js
// ❌ BAD — 1 + N queries (1 per user)
const users = await prisma.user.findMany()
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } })
}

// ✅ GOOD — 2 queries total (Prisma batches into IN clause)
const users = await prisma.user.findMany({ include: { posts: true } })
```

### Other Performance Fixes
```js
// Always limit results
await prisma.user.findMany({ take: 10 })

// Only fetch fields you need
await prisma.post.findMany({ select: { id: true, title: true } })

// Count without extra queries
await prisma.user.findMany({ include: { _count: { select: { posts: true } } } })
// user._count.posts = 5

// Run independent queries in parallel
const [users, posts] = await Promise.all([
  prisma.user.findMany(),
  prisma.post.findMany()
])

// Raw SQL when needed
const result = await prisma.$queryRaw`SELECT * FROM "User" WHERE age > ${25}`
// ⚠️ Never use $queryRawUnsafe with user input — SQL injection risk
```

### Query Logging
```js
const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }]
})
prisma.$on('query', (e) => {
  console.log('Query:', e.query)
  console.log('Duration:', e.duration, 'ms')
})
// 0-50ms = fine | 50-200ms = watch | 200ms+ = red flag | same query repeating = N+1
```

---

## 13. Soft Deletes & Audit Logs

### Soft Delete Schema
```prisma
model User {
  deletedAt DateTime?   // null = active, has value = deleted
}
```

```js
// Soft delete — mark as deleted
await prisma.user.update({ where: { id: 1 }, data: { deletedAt: new Date() } })

// Restore
await prisma.user.update({ where: { id: 1 }, data: { deletedAt: null } })

// Always filter active records
await prisma.user.findMany({ where: { deletedAt: null } })

// View deleted (admin)
await prisma.user.findMany({ where: { deletedAt: { not: null } } })
```

### Audit Log Schema
```prisma
model AuditLog {
  id        Int      @id @default(autoincrement())
  action    String   // "USER_CREATED", "POST_DELETED"
  entity    String   // "User", "Post"
  entityId  Int
  userId    Int?
  oldData   Json?
  newData   Json?
  createdAt DateTime @default(now())

  @@index([entity, entityId])
  @@index([userId])
  @@index([createdAt])
}
```

```js
// Always write audit log + operation in same transaction
async function deleteUser(id, adminId) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({ where: { id }, data: { deletedAt: new Date() } })
    await tx.auditLog.create({
      data: { action: 'USER_DELETED', entity: 'User', entityId: id, userId: adminId, oldData: user }
    })
    return user
  })
}
```

---

## 14. RBAC

```js
// permissions.js — central permission map
const permissions = {
  USER:      ['read:own_profile', 'update:own_profile', 'create:post', 'read:post'],
  MODERATOR: ['read:own_profile', 'update:own_profile', 'create:post', 'read:post', 'delete:any_post', 'read:any_user'],
  ADMIN:     ['read:own_profile', 'update:own_profile', 'create:post', 'read:post',
              'delete:any_post', 'read:any_user', 'update:any_user', 'delete:any_user', 'manage:roles', 'read:audit_logs']
}
function can(role, permission) { return permissions[role]?.includes(permission) ?? false }
```

```js
// middleware/auth.js
function isAuthenticated(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
  next()
}

function hasPermission(permission) {
  return (req, res, next) => {
    if (!can(req.user?.role, permission))
      return res.status(403).json({ error: `Forbidden — requires: ${permission}` })
    next()
  }
}

function isOwnerOrAdmin(getOwnerId) {
  return async (req, res, next) => {
    if (req.user?.role === 'ADMIN') return next()
    const ownerId = await getOwnerId(req)
    if (ownerId !== req.user?.id) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}
```

```js
// Usage in routes
router.get('/',    isAuthenticated, hasPermission('read:any_user'), handler)
router.delete('/:id', isAuthenticated, hasPermission('delete:any_user'), handler)
router.put('/:id', isAuthenticated, isOwnerOrAdmin(async (req) => Number(req.params.id)), handler)

// 401 = not logged in | 403 = logged in but not allowed
```

---

## 15. Real API Structure

```
backend/
├── prisma/schema.prisma
├── src/
│   ├── db.js
│   ├── index.js
│   ├── permissions.js
│   ├── middleware/
│   │   ├── auth.js          ← isAuthenticated, hasPermission, isOwnerOrAdmin
│   │   └── errorHandler.js  ← global Prisma error handler
│   ├── routes/
│   │   ├── users.js         ← HTTP only, calls service
│   │   └── posts.js
│   └── services/
│       ├── userService.js   ← all DB logic
│       └── postService.js
```

### Global Error Handler
```js
// middleware/errorHandler.js
const { Prisma } = require('@prisma/client')
function errorHandler(err, req, res, next) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Record not found' })
    if (err.code === 'P2002') return res.status(409).json({ error: 'Already exists' })
  }
  if (err instanceof Prisma.PrismaClientValidationError)
    return res.status(400).json({ error: 'Invalid data' })
  res.status(500).json({ error: 'Internal server error' })
}
module.exports = errorHandler
```

### Entry Point
```js
// src/index.js
const express      = require('express')
const userRoutes   = require('./routes/users')
const postRoutes   = require('./routes/posts')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(express.json())
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use(errorHandler)   // must be last
app.listen(3000, () => console.log('Running on http://localhost:3000'))
```

### Service Pattern (userService.js summary)
```js
const UserService = {
  async getAll({ page = 1, pageSize = 10 } = {}) { /* offset pagination + Promise.all */ },
  async getById(id) { /* findFirst with deletedAt: null */ },
  async create(data, adminId) { /* $transaction: create + auditLog */ },
  async update(id, data, adminId) { /* $transaction: fetch before, update, auditLog */ },
  async delete(id, adminId) { /* $transaction: soft delete + auditLog */ },
  async changeRole(id, role, adminId) { /* $transaction: update role + auditLog */ }
}
```

---

## 📋 Master Cheatsheet

### All Prisma Methods
| Method | Returns |
|--------|---------|
| `create()` | Created record |
| `createMany()` | `{ count }` |
| `findMany()` | Array |
| `findUnique()` | Record or null |
| `findFirst()` | Record or null |
| `update()` | Updated record |
| `updateMany()` | `{ count }` |
| `upsert()` | Record |
| `delete()` | Deleted record (throws if missing) |
| `deleteMany()` | `{ count }` |
| `count()` | Number |
| `$transaction([])` | Array of results |
| `$transaction(async tx)` | Whatever you return |
| `$queryRaw` | Typed query results |
| `$executeRaw` | Affected row count |