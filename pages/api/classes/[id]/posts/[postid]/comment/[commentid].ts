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
    const comment = await prisma.postComment.findFirst({
        where: {
            id: String(req.query.commentid)
        },
        include: {
            User: true
        }
    })
    const { text } = req.body

    switch(req.method){
        case 'PATCH':
            if(session?.user.level!=='SUPER_TEACHER'&&comment?.userId===session?.user.id) return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            return res.json(await prisma.postComment.update({
                where: {
                    id: String(req.query.commentid)
                },
                data: {
                    text
                }
            }))
        case'DELETE':
            if(session?.user.level!=='SUPER_TEACHER'&&comment?.userId!==session?.user.id) return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            if(!comment)return res.status(400).json({ message: "invalid comment!" })

            await prisma.postComment.delete({
                where: {
                    id: comment.id
                }
            })
            return res.status(200).json({ message: "comment successfully deleted!" })
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}