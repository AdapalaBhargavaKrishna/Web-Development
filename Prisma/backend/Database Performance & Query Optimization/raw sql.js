const prisma = require('./db.js')

async function main() {
    // Raw query — returns typed results
    const usersRaw = await prisma.$queryRaw`
        SELECT id, name, email
        FROM "User"
        WHERE age > ${25}
        ORDER BY "createdAt" DESC
        LIMIT 10
    `
    console.log("Users from raw query with age > 25:", usersRaw)

    const minAge = 25
    const usersWithMinAge = await prisma.$queryRaw`
        SELECT * FROM "User"
        WHERE age > ${minAge}
    `
    console.log(`Users from raw query with age > ${minAge}:`, usersWithMinAge)

    // Execute raw — for INSERT, UPDATE, DELETE (returns count)
    const updateResult = await prisma.$executeRaw`
        UPDATE "User" SET age = age + 1
        WHERE id = ${1}
    `
    console.log("Rows affected by update:", updateResult)  // number of rows affected
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())