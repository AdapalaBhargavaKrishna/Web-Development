const prisma = require('./db.js')

async function main() {
    // Count posts per user
    const usersWithPostCounts = await prisma.user.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        }
    })
    // user._count.posts = 5
    console.log("Users with post counts:", usersWithPostCounts)
    for (const user of usersWithPostCounts) {
        console.log(`User ${user.name} has ${user._count.posts} posts`)
    }

    // Count multiple relations at once
    const usersWithMultipleCounts = await prisma.user.findMany({
        include: {
            _count: {
                select: {
                    posts: true,    // count posts
                    profile: true   // count profile
                }
            }
        }
    })
    console.log("Users with multiple relation counts:", usersWithMultipleCounts)
    for (const user of usersWithMultipleCounts) {
        console.log(`User ${user.name} has ${user._count.posts} posts and ${user._count.profile} profiles`)
    }

    // Count with a filter
    const postsWithFilteredCounts = await prisma.post.findMany({
        include: {
            _count: {
                select: {
                    posts: {
                        where: { published: true }  // only count published posts
                    }
                }
            }
        }
    })

    console.log("Posts with filtered counts:", postsWithFilteredCounts)
    for (const post of postsWithFilteredCounts) {
        console.log(`Post ${post.title} has ${post._count.posts} published posts`)
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())