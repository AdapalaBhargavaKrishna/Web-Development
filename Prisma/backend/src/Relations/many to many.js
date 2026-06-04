const prisma = require('../db')

async function main() {

    // -----------------------CREATE----------------------- 

    // Create a post with tags
    const postWithTags = await prisma.post.create({
        data: {
            title: "Prisma Tutorial",
            authorId: 14,
            tags: {
                create: [
                    { name: "prisma" },
                    { name: "nodejs" }
                ]
            }
        },
        include: { tags: true }
    })
    console.log(postWithTags)

    // Connect existing tags to a post
    const postWithConnectedTags = await prisma.post.update({
        where: { id: 1 },
        data: {
            tags: {
                connect: [{ id: 1 }, { id: 2 }]
            }
        },
        include: { tags: true }
    })
    console.log(postWithConnectedTags)

    // include → gets ALL fields of related model
    const userWithPosts = await prisma.user.findUnique({
        where: { id: 1 },
        include: { posts: true }
    })
    console.log(userWithPosts)

    // select → you control exactly what fields come back
    const userWithSelectedFields = await prisma.user.findUnique({
        where: { id: 1 },
        select: {
            name: true,
            posts: {
                select: {
                    title: true  // only get post titles, not all fields
                }
            }
        }
    })
    console.log(userWithSelectedFields)

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())