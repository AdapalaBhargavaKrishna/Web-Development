const prisma = require('./db.js')

async function main() {
    // Soft delete a user (set deletedAt timestamp)
    const softDeletedUser = await prisma.user.update({
        where: { id: 13 },
        data: { deletedAt: new Date() }
    })
    console.log("Soft deleted user:", softDeletedUser.deletedAt)  // 2024-01-15T10:30:00.000Z

    // Get only active users (not soft deleted)
    const activeUsers = await prisma.user.findMany({
        where: { deletedAt: null }
    })
    console.log("Active users (deletedAt = null):", activeUsers)

    // Find a specific active user
    const activeUser = await prisma.user.findFirst({
        where: {
            id: 13,
            deletedAt: null
        }
    })
    console.log("Active user with id 13:", activeUser)

    // Restore a soft deleted user by setting deletedAt back to null
    const restoredUser = await prisma.user.update({
        where: { id: 1 },
        data: { deletedAt: null }
    })
    console.log("Restored user:", restoredUser)
    console.log("User restored!")

    // Get only deleted users
    const deletedUsers = await prisma.user.findMany({
        where: {
            deletedAt: { not: null }
        }
    })
    console.log("Only deleted users:", deletedUsers)

    // Get ALL users including deleted (admin panel)
    const allUsers = await prisma.user.findMany()
    // no filter = returns everything including soft deleted
    console.log("All users (including soft deleted):", allUsers)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())