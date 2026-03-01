const prisma = require('./db.js')

async function main() {

    // -----------------------AND----------------------- 

    // Get users where age > 20 AND name contains "ali"
    const usersAnd = await prisma.user.findMany({
        where: {
            AND: [
                { age: { gt: 20 } },
                { name: { contains: 'ali', mode: 'insensitive' } }
            ]
        }
    })
    console.log(usersAnd)

    // This is identical to using AND
    const usersAndImplicit = await prisma.user.findMany({
        where: {
            age: { gt: 20 },
            name: { contains: "ali", mode: "insensitive" }
        }
    })
    console.log(usersAndImplicit)

    // -----------------------OR----------------------- 

    // Get users where age < 20 OR age > 30
    const usersOrAge = await prisma.user.findMany({
        where: {
            OR: [
                { age: { lt: 20 } },
                { age: { gt: 30 } }
            ]
        }
    })
    console.log(usersOrAge)

    // Get users where name is "Alice" OR email is "bob@gmail.com"
    const usersOrNameEmail = await prisma.user.findMany({
        where: {
            OR: [
                { name: "Alice" },
                { email: "bob@gmail.com" }
            ]
        }
    })
    console.log(usersOrNameEmail)

    // -----------------------NOT----------------------- 

    // Get all users where name is NOT "Alice"
    const usersNotName = await prisma.user.findMany({
        where: {
            NOT: { name: "Alice" }
        }
    })
    console.log(usersNotName)

    // Get users where age is NOT in this list
    const usersNotAge = await prisma.user.findMany({
        where: {
            NOT: { age: { in: [20, 25, 30] } }
        }
    })
    console.log(usersNotAge)

    // -----------------------Combining----------------------- 

    // Get users where:
    // age > 18 AND (name is "Alice" OR name is "Bob") AND NOT email is "test@gmail.com"
    const usersCombined = await prisma.user.findMany({
        where: {
            AND: [
                { age: { gt: 18 } },
                {
                    OR: [
                        { name: "Alice" },
                        { name: "Bob" }
                    ]
                },
                {
                    NOT: { email: "test@gmail.com" }
                }
            ]
        }
    })
    console.log(usersCombined)

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())