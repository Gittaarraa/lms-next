import { PrismaClient } from '@prisma/client'
import * as argon2 from "argon2";

const prisma = new PrismaClient()

async function main() {
  const master = await prisma.user.upsert({
    where: { username: process.env.MASTER_USERNAME },
    update: {},
    create: {
        username: process.env.MASTER_USERNAME||'admin',
        password: await argon2.hash(process.env.MASTER_PASSWORD||'admin', {timeCost: 32, parallelism: 2}),
        level: 'SUPER_TEACHER',
        name: 'Administrator'
    },
  })
  console.log({ master })
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})