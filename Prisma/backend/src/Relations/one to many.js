const prisma = require('../db')

async function main() {

    // -----------------------CREATE----------------------- 

    // Create a user WITH posts at the same time
    const userWithPosts = await prisma.user.create({
        data: {
            name: "Alice",
            email: "alice@gmail.com",
            age: 25,
            posts: {
                create: [
                    { title: "My First Post", content: "Hello World!" },
                    { title: "My Second Post", content: "Prisma is awesome!" }
                ]
            }
        },
        include: { posts: true }
    })
    console.log(userWithPosts)

    // Create a post and connect to existing user
    const newPost = await prisma.post.create({
        data: {
            title: "New Post",
            content: "Some content",
            author: {
                connect: { id: 13 }
            }
        }
    })
    console.log(newPost)

    // -----------------------READ----------------------- 

    // Get user WITH all their posts
    const userWithPosts2 = await prisma.user.findUnique({
        where: { id: 15 },
        include: { posts: true }
    })
    console.log(userWithPosts2)

    // Get ALL users with their posts
    const allUsersWithPosts = await prisma.user.findMany({
        include: { posts: true }
    })
    console.log(allUsersWithPosts)

    // Get post WITH its author
    const postWithAuthor = await prisma.post.findUnique({
        where: { id: 1 },
        include: { author: true }
    })
    console.log(postWithAuthor)

    // Filter included posts
    const userWithFilteredPosts = await prisma.user.findUnique({
        where: { id: 1 },
        include: {
            posts: {
                where: { published: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    })
    console.log(userWithFilteredPosts)

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())