import config from "@/utils/config"
import * as argon2 from "argon2";
import { prisma } from "@/utils/prismaConnect"
import { NextApiRequest, NextApiResponse } from "next"
import slugify from "slugify";
import cuid from "cuid";

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

    switch(req.method){
        case 'POST':
            if(session?.user.level!=='SUPER_TEACHER'&&session?.user.level!=='TEACHER') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            const { className, section } = req.body
            if(!className||!section)return res.status(400).json({ message: "Class Name and Section is required!" })
            const kelas = await prisma.kelas.create({
                data: {
                    className,
                    section,
                    ownerId: session.user.id,
                    InviteCode: {
                        create: {
                            code: `${slugify(className, { lower: true })}-${cuid.slug()}`
                        }
                    }
                }
            })
            return res.json(await prisma.classMate.create({
                data: {
                    classId: kelas.id,
                    userId: session.user.id
                }
            }))

        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}