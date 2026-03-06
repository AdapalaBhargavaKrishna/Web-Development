const prisma = require('./db.js')

async function main() {

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())