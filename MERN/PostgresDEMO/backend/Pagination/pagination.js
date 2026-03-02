const prisma = require('./db.js')

async function main() {

    // -----------------------Pagination----------------------- 

    const users = await prisma.user.findMany({
        take: 10,
        skip: 0
    })
    console.log("Page 1 users:", users)

    const users1 = await prisma.user.findMany({
        take: 10,
        skip: 10
    })
    console.log("Page 2 users:", users1)

    const users2 = await prisma.user.findMany({
        take: 10,
        skip: 20
    })
    console.log("Page 3 users:", users2)

    // Clean reusable function
    async function getUsers(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                take: pageSize,
                skip: skip,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count()
        ])

        return {
            data: users,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            hasNextPage: skip + pageSize < total,
            hasPrevPage: page > 1
        }
    }

    // Usage
    const result = await getUsers(2, 10)
    console.log("Paginated result with metadata:", result)
    // {
    //   data: [...10 users],
    //   total: 100,
    //   page: 2,
    //   totalPages: 10,
    //   hasNextPage: true,
    //   hasPrevPage: true
    // }

    // -----------------------Cursor Pagination----------------------- 

    // First page
    const firstpage = await prisma.user.findMany({
        take: 10,
        orderBy: { id: 'asc' }
    })
    console.log("First page (cursor):", firstpage)

    // First page — no cursor yet
    const lastUser = firstpage[firstpage.length - 1]
    const cursor = lastUser.id
    console.log("Cursor from first page:", cursor)

    const secondpage = await prisma.user.findMany({
        take: 10,
        skip: 1,
        cursor: { id: cursor }
    })
    console.log("Second page (cursor):", secondpage)

    async function getUsersCursor(cursor = null, pageSize = 10) {
        const users = await prisma.user.findMany({
            take: pageSize + 1,    // fetch one extra to check if next page exists
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor }
            }),
            orderBy: { id: 'asc' }
        })

        const hasNextPage = users.length > pageSize

        // remove the extra record we fetched
        if (hasNextPage) users.pop()

        const nextCursor = hasNextPage ? users[users.length - 1].id : null

        return {
            data: users,
            hasNextPage,
            nextCursor   // send this back to frontend, use it in next request
        }
    }

    // First page
    const page1 = await getUsersCursor()
    console.log("Cursor pagination page 1:", page1)
    // { data: [...10 users], hasNextPage: true, nextCursor: 10 }

    // Second page — pass the cursor from previous response
    const page2 = await getUsersCursor(page1.nextCursor)
    console.log("Cursor pagination page 2:", page2)
    // { data: [...10 users], hasNextPage: true, nextCursor: 20 }

    // Keep going until hasNextPage is false
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())