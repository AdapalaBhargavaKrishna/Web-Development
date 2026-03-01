# 📊 Schema Design & Indexing

---

## Part 1 — Schema Design Rules

### ❌ Never store multiple values in one field

```prisma
// ❌ BAD
model User {
  phones String  // "123456, 789012, 345678" — terrible idea
}

// ✅ GOOD — separate table
model User {
  phones Phone[]
}
model Phone {
  id     Int    @id @default(autoincrement())
  number String
  userId Int
  user   User   @relation(fields: [userId], references: [id])
}
```

---

### ❌ Never store calculated / redundant data

```prisma
// ❌ BAD — can go out of sync with real data
model Order {
  itemCount  Int
  totalPrice Int
}

// ✅ GOOD — calculate at query time
const order = await prisma.order.findUnique({
  where: { id: 1 },
  include: { _count: { select: { items: true } } }
})
```

---

### ✅ Always define onDelete on relations

```prisma
model Post {
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

| Option | Behavior |
|--------|---------|
| `Cascade` | Delete child records when parent is deleted |
| `Restrict` | Block parent deletion if children exist |
| `SetNull` | Set foreign key to null when parent deleted |
| `NoAction` | DB decides — can throw errors |

---

### ✅ Use enum for fixed set of values

```prisma
// ❌ BAD — raw strings can have typos
model User {
  role String  // someone might write "Admin" vs "admin" vs "ADMIN"
}

// ✅ GOOD — enum enforces valid values at compile time
enum Role {
  USER
  ADMIN
  MODERATOR
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model User {
  role   Role       @default(USER)
  status PostStatus @default(DRAFT)
}
```

---

## Part 2 — Indexing

---

### The Problem — Full Table Scan

Imagine your User table has 1,000,000 rows:

```
Row 1       → { id: 1,       email: "alice@gmail.com"   }
Row 2       → { id: 2,       email: "zebra@gmail.com"   }
Row 3       → { id: 3,       email: "bob@gmail.com"     }
Row 4       → { id: 4,       email: "charlie@gmail.com" }
...
Row 1000000 → { id: 1000000, email: "diana@gmail.com"   }
```

When you run:

```js
await prisma.user.findUnique({ where: { email: "diana@gmail.com" } })
```

Without an index, Postgres starts at Row 1 and checks
every single row one by one until it finds a match.
That is 1,000,000 comparisons in the worst case.
This is called a Full Table Scan. O(n).

---

### The Solution — B-Tree Index

When you add an index on `email`, Postgres builds a
separate B-Tree (Binary Search Tree) data structure
behind the scenes, sorted alphabetically:

```
                      "charlie@gmail.com"
                     /                   \
          "bob@gmail.com"           "zebra@gmail.com"
          /                          /
  "alice@gmail.com"           "diana@gmail.com"
```

Each node also stores a POINTER to the actual row in the table.

Now searching for "diana@gmail.com":

```
Step 1 → Is "diana" > "charlie"?  YES  → go RIGHT
Step 2 → Is "diana" < "zebra"?    YES  → go LEFT
Step 3 → Found "diana@gmail.com" ✅  → follow pointer → fetch row
```

3 steps instead of 1,000,000. This is O(log n).

---

### The Real Performance Numbers

| Rows | Without Index (O n) | With Index (O log n) |
|------|---------------------|----------------------|
| 1,000 | 1,000 comparisons | ~10 steps |
| 100,000 | 100,000 comparisons | ~17 steps |
| 1,000,000 | 1,000,000 comparisons | ~20 steps |
| 10,000,000 | 10,000,000 comparisons | ~23 steps |

> Going from 1 million to 10 million rows only adds ~3 steps
> with an index. That is the power of O(log n).

---

### What the Index Looks Like in Postgres

Postgres maintains a separate hidden sorted table:

```
INDEX on email:
┌─────────────────────────┬─────────────┐
│ email (sorted)          │ row pointer │
├─────────────────────────┼─────────────┤
│ alice@gmail.com         │ → Row 1     │
│ bob@gmail.com           │ → Row 3     │
│ charlie@gmail.com       │ → Row 4     │
│ diana@gmail.com         │ → Row 1M    │
│ zebra@gmail.com         │ → Row 2     │
└─────────────────────────┴─────────────┘
```

Postgres binary searches this sorted index, finds the
pointer, then jumps DIRECTLY to that row. No scanning needed.

---

### @unique already creates an index automatically

```prisma
email String @unique  // automatically indexed by Prisma
```

You get free indexing on every @unique field.

---

### @@index — Add indexes for fields you query often

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  published Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  author    User     @relation(fields: [authorId], references: [id])

  @@index([authorId])             // single field index
  @@index([published, createdAt]) // composite index
}
```

> ⚠️ Prisma does NOT auto-index foreign keys like authorId.
> You must add @@index manually on every foreign key!

---

### When to add @@index

```js
// You filter by a field often
await prisma.post.findMany({ where: { authorId: 1 } })
// → add @@index([authorId])

// You sort by a field often
await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
// → add @@index([createdAt])

// You filter AND sort together
await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' }
})
// → add @@index([published, createdAt])
```

---

### Why indexes slow down Writes

Every time you INSERT or UPDATE a record:

```js
await prisma.user.create({ data: { email: "newuser@gmail.com" } })
```

Postgres must:
1. Insert the row into the main table
2. Find the correct sorted position in the B-Tree
3. Insert into the index and rebalance the tree

If you have 5 indexes on a table, that is 5 tree
updates on every single write. On write-heavy tables
this adds up very fast.

---

### Composite Index — Order Matters!

```prisma
@@index([status, createdAt])
```

```js
where: { status: "PUBLISHED" }                        // ✅ can use this index
where: { status: "PUBLISHED", createdAt: ... }        // ✅ can use this index
where: { createdAt: ... }                             // ❌ cannot use this index alone
```

Think of a phone book sorted by Last Name then First Name:
- You CAN search by last name alone
- You CAN search by last name + first name together
- You CANNOT efficiently search by first name alone

Always put the most filtered / most selective field FIRST
in a composite index.

---

### When to Index and When NOT to

```
✅ ADD @@index when you frequently:
   - Filter by a field in WHERE clause
   - Sort by a field in ORDER BY
   - Use a field as a foreign key (authorId, userId etc)
   - Filter + sort by multiple fields together

❌ DO NOT add @@index on:
   - Fields you rarely query
   - Long text fields (bio, content, description)
   - Tables that are very write-heavy
   - Every single field "just in case"
```

---

### Production-Ready Schema Putting It All Together

```prisma
enum Role {
  USER
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model User {
  id        Int        @id @default(autoincrement())
  name      String
  email     String     @unique              // auto-indexed
  role      Role       @default(USER)
  createdAt DateTime   @default(now())
  posts     Post[]
  profile   Profile?

  @@index([role])                           // filter users by role often
}

model Post {
  id        Int        @id @default(autoincrement())
  title     String
  content   String?
  status    PostStatus @default(DRAFT)
  authorId  Int
  createdAt DateTime   @default(now())
  author    User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags      Tag[]

  @@index([authorId])                       // foreign key — always index
  @@index([status, createdAt])              // filter by status + sort by date
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  userId Int     @unique                   // auto-indexed + makes it one-to-one
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique                     // auto-indexed
  posts Post[]
}
```

Then push to Supabase:

```bash
npx prisma db push
npx prisma generate
```

---

## Quick Summary

| Concept | Rule |
|---------|------|
| Full Table Scan | No index = Postgres checks every row = O(n) |
| B-Tree Index | Sorted tree = jumps to row directly = O(log n) |
| `@unique` | Auto-creates an index, no extra work needed |
| Foreign keys | Always add `@@index` manually — Prisma won't do it |
| Composite index | Order matters — most filtered field goes first |
| Too many indexes | Slows down writes — only index what you query |
| enum | Use for fixed string values — prevents typos |
| onDelete | Always define on every relation |