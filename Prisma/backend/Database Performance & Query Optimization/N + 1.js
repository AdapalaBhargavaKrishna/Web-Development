const prisma = require('./db.js')

async function main() {

    // Example 1: Basic N+1 problem
    const users = await prisma.user.findMany()
    console.log("All users:", users)

    for (const user of users) {
        const posts = await prisma.post.findMany({
            where: {
                authorId: user.id
            }
        })
        console.log(`Posts for user ${user.id}:`, posts)
    }

    // -----------------------Fix----------------------- 

    // ✅ GOOD — Using include to solve N+1
    const usersWithPosts = await prisma.user.findMany({
        include: { posts: true }
    })
    console.log("Users with posts (fixed N+1):", usersWithPosts)

    // ❌ BAD — N+1 inside N+1 (catastrophic)
    const usersNested = await prisma.user.findMany()           // 1 query
    console.log("Users for nested example:", usersNested)

    for (const user of usersNested) {
        const posts = await prisma.post.findMany({         // N queries
            where: { authorId: user.id }
        })
        console.log(`Posts for user ${user.id} (with tags):`, posts)

        for (const post of posts) {
            const tags = await prisma.tag.findMany({         // N*M queries
                where: { posts: { some: { id: post.id } } }
            })
            console.log(`Tags for post ${post.id}:`, tags)
        }
    }
    // With 100 users and 10 posts each = 1 + 100 + 1000 = 1101 queries!

    // ✅ GOOD — 1 query, deeply nested include
    const usersWithNestedData = await prisma.user.findMany({
        include: {
            posts: {
                include: {
                    tags: true   // gets tags for every post in the same query
                }
            }
        }
    })
    console.log("Users with posts and tags (single query):", usersWithNestedData)

    // ✅ Even better — don't fetch fields you don't use
    const selectusers = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            posts: {
                select: {
                    id: true,
                    title: true,
                    tags: {
                        select: { name: true }
                    }
                }
            }
        }
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())