import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../utils/prismaConnect'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = String(req.query.token)
    const user = await prisma.session.findFirst({
        where: {
            token,
            expire: {
                gte: new Date()
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    level: true,
                }
            }
        },
    })

    if(!user) return res.status(403).json({ message: 'unauthorized!' })
    return res.status(200).json({ session: user })
}