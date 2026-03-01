# 📘 Prisma ORM with Supabase PostgreSQL — Learning Notes

> **Stack:** Node.js + Prisma v5 + Supabase PostgreSQL  
> **Folder:** `backend/`

---

## 🛠️ Setup & Installation

```bash
mkdir backend && cd backend
npm init -y
npm install prisma@5 --save-dev
npm install @prisma/client@5
npm install express dotenv
npx prisma init
```

### .env Configuration

> ⚠️ Use **Direct Connection (port 5432)** for Prisma CLI commands. Port 6543 (pooler) causes the CLI to hang.

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

| Port | Type | Use For |
|------|------|---------|
| `5432` | Direct Connection | `db push`, `migrate`, `prisma studio` |
| `6543` | Connection Pooler | Production app runtime queries |

### Prisma Client (`src/db.js`)

```js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
module.exports = prisma
```

> ⚠️ Always create **one single instance** of PrismaClient and reuse it everywhere.

### Useful CLI Commands

| Command | Purpose |
|---------|---------|
| `npx prisma db push` | Push schema to DB (no migration files) |
| `npx prisma generate` | Regenerate Prisma Client after schema changes |
| `npx prisma studio` | Visual DB browser at `http://localhost:5555` |
| `npx prisma migrate dev` | Create + apply migration with history |

---

## 📐 Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  age       Int?                  // ? = optional / nullable
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
  profile   Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  tags      Tag[]
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

### Field Modifiers

| Modifier | Meaning |
|----------|---------|
| `@id` | Primary key |
| `@unique` | Must be unique across all rows |
| `?` | Optional / nullable field |
| `@default(autoincrement())` | Auto-incrementing integer |
| `@default(now())` | Auto-set to current timestamp |
| `@updatedAt` | Auto-updates on every change |

---

## ✍️ CREATE

```js
// Create one — returns the created record
const user = await prisma.user.create({
  data: { name: "Alice", email: "alice@gmail.com", age: 25 }
})

// Create many — returns { count } not records
await prisma.user.createMany({
  data: [
    { name: "Bob", email: "bob@gmail.com" },
    { name: "Charlie", email: "charlie@gmail.com" }
  ]
})

// Create and return only specific fields
const user = await prisma.user.create({
  data: { name: "Eve", email: "eve@gmail.com" },
  select: { id: true, name: true }
})
```

---

## 📖 READ

```js
// Get all
const users = await prisma.user.findMany()

// Get one by unique field
const user = await prisma.user.findUnique({ where: { id: 1 } })
const user = await prisma.user.findUnique({ where: { email: "alice@gmail.com" } })

// Get first match by any field
const user = await prisma.user.findFirst({ where: { name: "Alice" } })

// Filter
const users = await prisma.user.findMany({ where: { age: { gt: 20 } } })

// Select specific fields
const users = await prisma.user.findMany({
  select: { id: true, name: true }
})

// Sort
const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })

// Pagination
const users = await prisma.user.findMany({ take: 5, skip: 10 })

// Count
const count = await prisma.user.count()
```

### Filter Operators

| Operator | Meaning |
|----------|---------|
| `gt` | greater than |
| `gte` | greater than or equal |
| `lt` | less than |
| `lte` | less than or equal |
| `contains` | like `%value%` |
| `startsWith` | like `value%` |
| `endsWith` | like `%value` |
| `not` | not equal |
| `in` | matches any value in array |

---

## ✏️ UPDATE

```js
// Update one
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Alice Updated", age: 26 }
})

// Update many — returns { count }
await prisma.user.updateMany({
  where: { age: { lt: 25 } },
  data: { age: 25 }
})

// Numeric shortcuts
await prisma.user.update({
  where: { id: 1 },
  data: { age: { increment: 1 } }
})
// also: decrement, multiply, divide

// Upsert — update if exists, create if not
await prisma.user.upsert({
  where: { email: "alice@gmail.com" },
  update: { name: "Alice Updated" },
  create: { name: "Alice", email: "alice@gmail.com", age: 25 }
})
```

---

## 🗑️ DELETE

```js
// Delete one — returns the deleted record
const user = await prisma.user.delete({ where: { id: 1 } })

// Delete many — returns { count }
await prisma.user.deleteMany({ where: { age: { lt: 20 } } })

// Delete ALL records ⚠️
await prisma.user.deleteMany()

// Always wrap in try/catch
try {
  await prisma.user.delete({ where: { id: 999 } })
} catch (error) {
  console.log("Record not found!")
}
```

---

## 🔗 Relations

### One to Many (User → Posts)

```js
// Create with nested relation
const user = await prisma.user.create({
  data: {
    name: "Alice",
    email: "alice@gmail.com",
    posts: {
      create: [{ title: "Post 1" }, { title: "Post 2" }]
    }
  },
  include: { posts: true }
})

// Connect to existing record
const post = await prisma.post.create({
  data: {
    title: "New Post",
    author: { connect: { id: 1 } }
  }
})

// Fetch with relations
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
})

// Filter included relations
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    }
  }
})
```

### `include` vs `select`

```js
// include → gets ALL fields of related model
include: { posts: true }

// select → you control exactly what comes back
select: {
  name: true,
  posts: { select: { title: true } }
}
```

---

## 🔍 AND, OR, NOT Filtering

```js
// AND (also the default behavior)
await prisma.user.findMany({
  where: {
    AND: [{ age: { gt: 20 } }, { name: { contains: "ali", mode: "insensitive" } }]
  }
})

// OR
await prisma.user.findMany({
  where: { OR: [{ age: { lt: 20 } }, { age: { gt: 30 } }] }
})

// NOT
await prisma.user.findMany({
  where: { NOT: { name: "Alice" } }
})

// Relation filters
await prisma.user.findMany({ where: { posts: { some: { published: true } } } })
await prisma.user.findMany({ where: { posts: { every: { published: true } } } })
await prisma.user.findMany({ where: { posts: { none: {} } } })

// Null checks
await prisma.user.findMany({ where: { age: null } })
await prisma.user.findMany({ where: { age: { not: null } } })
```

---

## 🔒 Transactions

```js
// Array transaction — operations don't depend on each other
const [user1, user2] = await prisma.$transaction([
  prisma.user.update({ where: { id: 1 }, data: { age: { decrement: 1 } } }),
  prisma.user.update({ where: { id: 2 }, data: { age: { increment: 1 } } })
])

// Interactive transaction — use result of one step in the next
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { name: "Bob", email: "bob@gmail.com" }
  })
  const post = await tx.post.create({
    data: { title: "Bob's Post", authorId: user.id }
  })
  return { user, post }
})

// With timeout options
await prisma.$transaction(async (tx) => { /* ... */ }, {
  maxWait: 5000,
  timeout: 10000
})
```

> ⚠️ Always use `tx` instead of `prisma` inside interactive transactions.  
> ✅ If any operation fails, ALL are rolled back automatically.

---

## 📋 Full CRUD Cheatsheet

| Operation | Method |
|-----------|--------|
| Create one | `prisma.model.create()` |
| Create many | `prisma.model.createMany()` |
| Read all | `prisma.model.findMany()` |
| Read one (unique) | `prisma.model.findUnique()` |
| Read first match | `prisma.model.findFirst()` |
| Update one | `prisma.model.update()` |
| Update many | `prisma.model.updateMany()` |
| Update or create | `prisma.model.upsert()` |
| Delete one | `prisma.model.delete()` |
| Delete many | `prisma.model.deleteMany()` |
| Count | `prisma.model.count()` |
| Raw transaction | `prisma.$transaction([])` |
| Interactive transaction | `prisma.$transaction(async tx => {})` |