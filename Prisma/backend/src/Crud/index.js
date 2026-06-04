const prisma = require('../db')

async function main() {

    // -----------------------CREATE----------------------- 

    // Create a User 
    const user = await prisma.user.create({
        data: {
            name: 'Bhargava',
            email: 'bk.adapala@gmail.com',
            age: 25
        }
    })
    console.log(user)

    //Create multiple Users at once
    const users = await prisma.user.createMany({
        data: [
            { name: "Bob", email: "bob@gmail.com", age: 30 },
            { name: "Charlie", email: "charlie@gmail.com", age: 22 },
            { name: "Diana", email: "diana@gmail.com", age: 28 }
        ]
    })
    console.log(users)

    //Create and Return Selected Files only
    const userSelected = await prisma.user.create({
        data: {
            name: "Eve",
            email: "eve@gmail.com",
            age: 27
        },
        select: {
            id: true,
            name: true
        }
    })
    console.log(userSelected)

    //-----------------------READ-----------------------

    //Read all records
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)

    //Read one record by id
    const userbyid = await prisma.user.findUnique({
        where: { id: 1 }
    })
    console.log(userbyid)

    const userbyemail = await prisma.user.findUnique({
        where: { email: 'diana@gmail.com' }
    })
    console.log(userbyemail)

    //Read first match
    const firstUser = await prisma.user.findFirst({
        where: { name: 'Bhargava' }
    })
    console.log(firstUser)

    //Filter
    const usersByAge = await prisma.user.findMany({
        where: { age: 25 }
    })
    console.log(usersByAge)

    const usersAgeGreater = await prisma.user.findMany({
        where: { age: { gt: 20 } }
    })
    console.log(usersAgeGreater)

    //Sort
    const usersSortedAsc = await prisma.user.findMany({
        orderBy: { age: 'asc' }
    })
    console.log(usersSortedAsc)

    const usersSortedDesc = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    })
    console.log(usersSortedDesc)

    // take = limit, skip = offset
    const paginatedUsers = await prisma.user.findMany({
        take: 5,   // get 5 records
        skip: 10   // skip first 10 records
    })
    console.log(paginatedUsers)

    //-----------------------UPDATE-----------------------

    //Update a single record
    const updatedUser = await prisma.user.update({
        where: { id: 1 },
        data: {
            name: 'Alice updated',
            email: 'alice@gmail.com'
        }
    })
    console.log(updatedUser)

    //Update multiple fields at once
    const updatedUserFields = await prisma.user.update({
        where: { id: 1 },
        data: {
            name: 'Alice Smith',
            email: 'alicesmith@gmail.com'
        }
    })
    console.log(updatedUserFields)

    //Update many records
    const updateManyResult = await prisma.user.updateMany({
        where: { age: { lt: 25 } },
        data: { age: 25 }
    })
    console.log(updateManyResult)

    // Upsert — Update if exists, Create if not
    const upsertUser = await prisma.user.upsert({
        where: { email: 'alice@gmail.com' },
        update: { name: 'Alice Updated' },
        create: {
            name: 'Alice',
            email: 'alice@gmail.com',
            age: 25
        }
    })
    console.log(upsertUser)

    //-----------------------DELETE-----------------------

    //Delete single record
    const deletedUser = await prisma.user.delete({
        where: { id: 1 }
    })
    console.log(deletedUser)

    //Delete many records
    const deleteManyResult = await prisma.user.deleteMany({
        where: { age: { lt: 20 } }
    })
    console.log(deleteManyResult)

    //Delete all Records
    const deleteAllResult = await prisma.user.deleteMany()
    console.log(deleteAllResult)

    //Delete with Select
    const deletedUserSelect = await prisma.user.delete({
        where: { id: 11 },
        select: {
            id: true,
            name: true
        }
    })
    console.log(deletedUserSelect)

    //Error handle in delete
    try {
        const user = await prisma.user.delete({
            where: { age: 999 }
        })
        console.log('Deleted', user)
    } catch (error) {
        console.log('User not found!')
    }

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())