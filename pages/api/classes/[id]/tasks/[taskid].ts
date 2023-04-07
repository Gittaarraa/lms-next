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
    const { title, instruction, dueDate } = req.body

    switch(req.method){
        case 'PATCH':
            if(session?.user.level!=='SUPER_TEACHER'&&session?.user.level!=='TEACHER') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            return res.json(await prisma.task.update({
                where: {
                    id: String(req.query.taskid)
                },
                data: {
                    title,
                    instruction,
                    dueDate: dayjs(dueDate).toDate()
                }
            }))
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}