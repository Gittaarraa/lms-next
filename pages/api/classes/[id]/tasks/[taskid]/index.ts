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
    const task = await prisma.task.findFirst({
        where: {
            id: String(req.query.taskid)
        },
        include: {
            Kelas: true
        }
    })

    if(!task) return res.status(404).json({ meessage: "task not found!" })

    switch(req.method){
        case 'DELETE':
            if(session?.user.level!=='SUPER_TEACHER'&&session?.user.level!=='TEACHER') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            return res.json(await prisma.task.delete({
                where: {
                    id: task.id
                }
            }))
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}