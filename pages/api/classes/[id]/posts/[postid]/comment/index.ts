import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import config from "@/utils/config";
import { prisma } from "@/utils/prismaConnect";

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
        case'POST':
            if(!session?.user.id) return res.status(403).json({ message: 'undefined user error!' })
            const { text } = req.body
            if(!text)return res.status(400).json({ message: "comment required!" })
            return res.json(await prisma.postComment.create({
                data: {
                    text,
                    postId: String(req.query.postid),
                    userId: session.user.id
                }
            }))
    default:
        return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}