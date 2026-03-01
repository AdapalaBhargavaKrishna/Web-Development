const prisma = require('./db.js')

async function main() {

    // -----------------------CREATE----------------------- 

    // Create user with profile
    // const user = await prisma.user.create({
    //     data: {
    //         name: "Bob",
    //         email: "bob@gmail.com",
    //         profile: {
    //             create: { bio: "I love coding!" }
    //         }
    //     },
    //     include: { profile: true }
    // })
    // console.log(user)



}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect()) 