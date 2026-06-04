const prisma = require('./db.js')

async function main() {
    // Create user WITH audit log in a transaction
    async function createUser(data, performedByUserId = null) {
        return prisma.$transaction(async (tx) => {
            // Step 1 — create the user
            const user = await tx.user.create({ data })

            // Step 2 — log the action
            await tx.auditLog.create({
                data: {
                    action: 'USER_CREATED',
                    entity: 'User',
                    entityId: user.id,
                    userId: performedByUserId,
                    newData: user       // store what was created
                }
            })

            return user
        })
    }

    // Update user WITH audit log
    async function updateUser(id, newData, performedByUserId) {
        return prisma.$transaction(async (tx) => {
            // Step 1 — fetch current state BEFORE update
            const before = await tx.user.findUnique({ where: { id } })

            // Step 2 — perform the update
            const after = await tx.user.update({
                where: { id },
                data: newData
            })

            // Step 3 — log what changed
            await tx.auditLog.create({
                data: {
                    action: 'USER_UPDATED',
                    entity: 'User',
                    entityId: id,
                    userId: performedByUserId,
                    oldData: before,    // what it looked like before
                    newData: after      // what it looks like after
                }
            })

            return after
        })
    }

    // Soft delete WITH audit log
    async function deleteUser(id, performedByUserId) {
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id },
                data: { deletedAt: new Date() }
            })

            await tx.auditLog.create({
                data: {
                    action: 'USER_DELETED',
                    entity: 'User',
                    entityId: id,
                    userId: performedByUserId,
                    oldData: user
                }
            })

            return user
        })
    }

    // Get full history of a specific user
    const userHistory = await prisma.auditLog.findMany({
        where: {
            entity: 'User',
            entityId: 1
        },
        orderBy: { createdAt: 'desc' }
    })

    // Get all actions performed by a specific admin
    const adminActions = await prisma.auditLog.findMany({
        where: { userId: 5 },
        orderBy: { createdAt: 'desc' },
        take: 50
    })

    // Get all delete actions in the last 7 days
    const recentDeletes = await prisma.auditLog.findMany({
        where: {
            action: 'USER_DELETED',
            createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        }
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())