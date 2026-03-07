const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: [
        { level: 'query', emit: 'event' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' }
    ]
})

prisma.$on('query', (e) => {
    console.log('Query:', e.query)
    console.log('Params:', e.params)
    console.log('Duration:', e.duration, 'ms')
    console.log('---')
})

async function main() {
    const users = await prisma.user.findMany({
        include: { posts: true }
    })
    console.log(JSON.stringify(users, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())