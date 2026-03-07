const prisma = require('./db.js')

async function main() {
    // ❌ BAD — fetching ALL users when you only need 10
    const allUsers = await prisma.user.findMany()
    console.log("All users (BAD - fetching too many):", allUsers)

    // ✅ GOOD — always limit how many records you fetch
    const recentUsers = await prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
    })
    console.log("Recent 10 users (GOOD - limited):", recentUsers)

    // ❌ BAD — fetching all columns including heavy ones like content
    const allPosts = await prisma.post.findMany()
    console.log("All posts (BAD - fetching heavy columns):", allPosts)

    // ✅ GOOD — only fetch what the UI actually needs
    const postsLight = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            createdAt: true,
            author: {
                select: { name: true }
            }
            // content field skipped — it could be thousands of characters
        }
    })
    console.log("Posts with selected fields (GOOD - lightweight):", postsLight)

    // ❌ This is slow if status has no index — full table scan
    const publishedPosts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' }
    })
    console.log("Published posts (might be slow without index):", publishedPosts)

    // ✅ Add composite index for this exact query pattern
    // model Post {
    //         @@index([status, createdAt])
    //     }

    // ❌ BAD — running count query for every single user
    const usersForCount = await prisma.user.findMany()
    console.log("Users for manual counting:", usersForCount)

    for (const user of usersForCount) {
        const postCount = await prisma.post.count({   // N extra queries!
            where: { authorId: user.id }
        })
        console.log(`User ${user.name} has ${postCount} posts (BAD - N+1 count)`)
    }

    // ✅ GOOD — use _count to get counts in the same query
    const usersWithCounts = await prisma.user.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        }
    })
    console.log("Users with post counts (GOOD - single query):", usersWithCounts)

    for (const user of usersWithCounts) {
        console.log(`User ${user.name} has ${user._count.posts} posts (no extra queries!)`)
    }

    // ❌ BAD — sequential, total time = time1 + time2 + time3
    const usersSequential = await prisma.user.findMany()
    const postsSequential = await prisma.post.findMany()
    const tagsSequential = await prisma.tag.findMany()
    console.log("Sequential queries (BAD - slow):", {
        users: usersSequential.length,
        posts: postsSequential.length,
        tags: tagsSequential.length
    })

    // ✅ GOOD — parallel, total time = max(time1, time2, time3)
    const [usersParallel, postsParallel, tagsParallel] = await Promise.all([
        prisma.user.findMany(),
        prisma.post.findMany(),
        prisma.tag.findMany()
    ])
    console.log("Parallel queries (GOOD - faster):", {
        users: usersParallel.length,
        posts: postsParallel.length,
        tags: tagsParallel.length
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())