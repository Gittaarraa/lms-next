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
            if(session?.user.level!=='ADMIN'&&session?.user.level!=='TEACHER') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            const { sentence, classId } = req.body
            if(!sentence)return res.status(400).json({ message: "text required!" })
            return res.json(await prisma.post.create({
                data: {
                    sentence,
                    classId,
                    writerId: session.user.id,
                }
            }))
            default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}