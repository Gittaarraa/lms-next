import config from "@/utils/config"
import { prisma } from "@/utils/prismaConnect"
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
    const post = await prisma.post.findFirst({
        where: {
            id: String(req.query.id)
        },
        include: {
            Writer: true
        }
    })
    const { sentence } = req.body

    switch(req.method){
        case 'PATCH':
            if(session?.user.level!=='SUPER_TEACHER'&&post?.writerId!==session?.user.id) return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            return res.json(await prisma.post.update({
                where: {
                    id: String(req.query.postid)
                },
                data: {
                    sentence
                }
            }))
        case 'DELETE':
            if(session?.user.level!=='SUPER_TEACHER'&&post?.writerId!==session?.user.id) return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            return res.json(await prisma.post.delete({
                where: {
                    id: String(req.query.postid)
                }
            }))
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}