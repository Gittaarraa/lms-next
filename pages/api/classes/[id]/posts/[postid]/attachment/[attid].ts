import config from "@/utils/config"
import { prisma } from "@/utils/prismaConnect"
import dayjs from "dayjs"
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
    const attachment = await prisma.postAttachment.findFirst({
        where: {
            id: String(req.query.attid)
        }
    })

    const post = await prisma.post.findFirst({
        where: {
            id: String(req.query.postid)
        },
        include: {
            Writer: true
        }
    })

    if(!attachment) return res.status(404).json({ meessage: "attachment not found!" })

    switch(req.method){
        case 'DELETE':
            if(session?.user.level!=='SUPER_TEACHER'&&post?.writerId!==session?.user.id) return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            return res.json(await prisma.postAttachment.delete({
                where: {
                    id: attachment.id
                }
            }))
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}