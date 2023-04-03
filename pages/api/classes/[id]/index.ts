import config from "@/utils/config"
import { prisma } from "@/utils/prismaConnect"
import * as argon2 from "argon2";
import cuid from "cuid";
import slugify from "slugify";
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const token = req.cookies[config.cookie_name]
    const session = await prisma.session.findFirst({
        where: {
            token
        },
        include: {
            user: true 
        }
    })
    const { className, section } = req.body

    switch(req.method){
        case 'PATCH':
            if(session?.user.level!=='ADMIN'&&session?.user.level!=='TEACHER') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            return res.json(await prisma.kelas.update({
                where: {
                    id: String(req.query.id)
                },
                data: {
                    className,
                    section
                }
            }))
        case 'POST':
            if(session?.user.level!=='ADMIN'&&session?.user.level!=='TEACHER') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            return res.json(await prisma.inviteCode.create({
                data: {
                    code: `${slugify(className, { lower: true })}-${cuid.slug()}`,
                    kelasId: String(req.query.id)
                }
            }))
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}