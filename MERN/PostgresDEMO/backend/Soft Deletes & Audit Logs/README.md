# 🗑️ Lesson 13 — Soft Deletes & Audit Logs

---

## Why You Never Hard Delete in Production

```js
// ❌ Hard delete — data is GONE forever
await prisma.user.delete({ where: { id: 1 } })

// Problems:
// - No way to recover accidental deletions
// - Compliance laws (GDPR, financial) require data history
// - Related data becomes orphaned
// - No audit trail for who deleted what and when
// - User asks "why was my account deleted?" — you have no record
```

---

## Part 1 — Soft Deletes

A soft delete marks a record as deleted instead of removing it from the DB.

### Step 1 — Add deletedAt to schema

```prisma
model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  age       Int?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?            // null = active, has value = deleted
  posts     Post[]
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  published Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
  authorId  Int
  author    User      @relation(fields: [authorId], references: [id])
}
```

```bash
npx prisma db push
npx prisma generate
```

---

### Step 2 — Soft Delete instead of hard delete

```js
// Set deletedAt to current timestamp instead of deleting
const user = await prisma.user.update({
  where: { id: 1 },
  data: { deletedAt: new Date() }
})
// record still exists in DB, just marked as deleted
```

---

### Step 3 — Always filter out deleted records

```js
// ❌ BAD — returns deleted users too
const users = await prisma.user.findMany()

// ✅ GOOD — only active users
const users = await prisma.user.findMany({
  where: { deletedAt: null }
})

// Get one active user
const user = await prisma.user.findFirst({
  where: { id: 1, deletedAt: null }
})
```

---

### Step 4 — Restore a soft deleted record

```js
const user = await prisma.user.update({
  where: { id: 1 },
  data: { deletedAt: null }   // set back to null = active again
})
```

---

### Step 5 — View deleted records (admin use)

```js
// Only deleted users
const deletedUsers = await prisma.user.findMany({
  where: { deletedAt: { not: null } }
})

// All users including deleted (admin panel)
const allUsers = await prisma.user.findMany()
```

---

### Reusable Soft Delete Helpers

```js
// helpers/softDelete.js
const prisma = require('../db')

async function softDeleteUser(id) {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  })
}

async function restoreUser(id) {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: null }
  })
}

async function getActiveUsers() {
  return prisma.user.findMany({
    where: { deletedAt: null }
  })
}

async function isDeleted(id) {
  const user = await prisma.user.findUnique({ where: { id } })
  return user?.deletedAt !== null
}

module.exports = { softDeleteUser, restoreUser, getActiveUsers, isDeleted }
```

---

## Part 2 — Audit Logs

An audit log records every important action — who did what, when, and what changed.

### Step 1 — Create AuditLog model

```prisma
model AuditLog {
  id        Int      @id @default(autoincrement())
  action    String   // "USER_CREATED", "POST_DELETED", "PASSWORD_CHANGED"
  entity    String   // "User", "Post" — which table was affected
  entityId  Int      // which record was affected
  userId    Int?     // who performed the action (null = system action)
  oldData   Json?    // data BEFORE the change
  newData   Json?    // data AFTER the change
  ipAddress String?  // where the request came from
  createdAt DateTime @default(now())

  @@index([entity, entityId])  // look up logs for a specific record fast
  @@index([userId])             // look up all actions by a specific user
  @@index([createdAt])          // sort and filter logs by time
}
```

```bash
npx prisma db push
npx prisma generate
```

---

### Step 2 — Write audit logs on every important action

```js
// CREATE user + log it
async function createUser(data, performedByUserId = null) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data })

    await tx.auditLog.create({
      data: {
        action:   'USER_CREATED',
        entity:   'User',
        entityId: user.id,
        userId:   performedByUserId,
        newData:  user
      }
    })

    return user
  })
}

// UPDATE user + log it
async function updateUser(id, newData, performedByUserId) {
  return prisma.$transaction(async (tx) => {
    const before = await tx.user.findUnique({ where: { id } })  // state before
    const after  = await tx.user.update({ where: { id }, data: newData })

    await tx.auditLog.create({
      data: {
        action:   'USER_UPDATED',
        entity:   'User',
        entityId: id,
        userId:   performedByUserId,
        oldData:  before,   // what it looked like before
        newData:  after     // what it looks like after
      }
    })

    return after
  })
}

// SOFT DELETE user + log it
async function deleteUser(id, performedByUserId) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    await tx.auditLog.create({
      data: {
        action:   'USER_DELETED',
        entity:   'User',
        entityId: id,
        userId:   performedByUserId,
        oldData:  user
      }
    })

    return user
  })
}
```

---

### Step 3 — Query audit logs

```js
// Full history of a specific record
const userHistory = await prisma.auditLog.findMany({
  where: { entity: 'User', entityId: 1 },
  orderBy: { createdAt: 'desc' }
})

// All actions performed by a specific admin
const adminActions = await prisma.auditLog.findMany({
  where: { userId: 5 },
  orderBy: { createdAt: 'desc' },
  take: 50
})

// All deletes in the last 7 days
const recentDeletes = await prisma.auditLog.findMany({
  where: {
    action: 'USER_DELETED',
    createdAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  }
})
```

---

## Part 3 — Full UserService Combining Both

```js
// src/services/userService.js
const prisma = require('../db')

const UserService = {

  async getAll() {
    return prisma.user.findMany({
      where: { deletedAt: null }
    })
  },

  async create(data, adminId = null) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data })
      await tx.auditLog.create({
        data: {
          action: 'USER_CREATED', entity: 'User',
          entityId: user.id, userId: adminId, newData: user
        }
      })
      return user
    })
  },

  async update(id, newData, adminId) {
    return prisma.$transaction(async (tx) => {
      const before = await tx.user.findUnique({ where: { id } })
      const after  = await tx.user.update({ where: { id }, data: newData })
      await tx.auditLog.create({
        data: {
          action: 'USER_UPDATED', entity: 'User',
          entityId: id, userId: adminId, oldData: before, newData: after
        }
      })
      return after
    })
  },

  async delete(id, adminId) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { deletedAt: new Date() }
      })
      await tx.auditLog.create({
        data: {
          action: 'USER_DELETED', entity: 'User',
          entityId: id, userId: adminId, oldData: user
        }
      })
      return user
    })
  },

  async restore(id, adminId) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { deletedAt: null }
      })
      await tx.auditLog.create({
        data: {
          action: 'USER_RESTORED', entity: 'User',
          entityId: id, userId: adminId, newData: user
        }
      })
      return user
    })
  }
}

module.exports = UserService
```

---

## Quick Summary

| Concept | Key Point |
|---------|----------|
| Hard delete | Data gone forever — never do this in production |
| Soft delete | Set `deletedAt` timestamp instead of deleting |
| Active records | Always filter `where: { deletedAt: null }` |
| Restore | Set `deletedAt` back to `null` |
| AuditLog model | Records who did what, when, and what changed |
| `oldData` + `newData` | Store before and after state as JSON |
| Transaction | Always write audit log + DB operation together atomically |
| Indexes on AuditLog | Index `entity+entityId`, `userId`, `createdAt` |

---

## Soft Delete vs Hard Delete — When to use which

| Situation | Use |
|-----------|-----|
| User deletes their account | Soft delete — legal compliance |
| Admin removes spam post | Soft delete — audit trail needed |
| Truly temporary data (sessions, OTP codes) | Hard delete — no value in keeping |
| Financial records, orders, invoices | NEVER delete — soft delete only |
| User data under GDPR | Soft delete + anonymize the PII fields |