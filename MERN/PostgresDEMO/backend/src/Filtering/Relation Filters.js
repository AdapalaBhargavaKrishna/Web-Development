const prisma = require('./db.js')

async function main() {

    // -----------------------SOME----------------------- 

    // Get all users who have at least one published post
    const usersWithPublishedPosts = await prisma.user.findMany({
        where: {
            posts: {
                some: { published: true }
            }
        }
    })
    console.log(usersWithPublishedPosts)

    // -----------------------EVERY----------------------- 

    // Get all users where ALL posts are published
    const usersWithAllPostsPublished = await prisma.user.findMany({
        where: {
            posts: {
                every: { published: true }
            }
        }
    })
    console.log(usersWithAllPostsPublished)

    // -----------------------NONE----------------------- 

    // Get all users who have NO posts
    const usersWithNoPosts = await prisma.user.findMany({
        where: {
            posts: {
                none: {}
            }
        }
    })
    console.log(usersWithNoPosts)

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())