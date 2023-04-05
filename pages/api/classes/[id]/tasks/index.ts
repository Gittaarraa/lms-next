import { NextApiRequest, NextApiResponse } from "next";
import appconfig from "@/utils/config";
import { prisma } from "@/utils/prismaConnect";
import { AttachmentBody } from "@/pages/classes/[id]";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import cuid from "cuid";
import dayjs from "dayjs";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const token = req.cookies[appconfig.cookie_name]
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
            if(session?.user.level!=='SUPER_TEACHER'&&session?.user.level!=='TEACHER') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            const { title, attachments, instruction, dueDate }: { attachments: AttachmentBody[], title: any, instruction: any, dueDate: any } = req.body
            if(!title||!instruction||!dueDate)return res.status(400).json({ message: "text, instruction and due date required!" })
            const task = await prisma.task.create({
                data: {
                    title,
                    instruction,
                    dueDate: dayjs(dueDate).toDate(),
                    kelasId: String(req.query.id)
                }
            })
            for (const attachment of attachments) {
                if(!Array.isArray(attachment.buf))return res.status(400).json({ message: "file is invalid!" })
                const fileKey = `files/task/${String(req.query.id)}/${cuid()}/${attachment.name}`
                if(!existsSync(fileKey.substring(0, fileKey.lastIndexOf('/')))){
                    mkdirSync(fileKey.substring(0, fileKey.lastIndexOf('/')), { recursive: true })
                }
                writeFileSync(fileKey, Buffer.from(Uint8Array.from(attachment.buf)))
                await prisma.taskAttachment.create({
                    data: {
                        file: fileKey,
                        taskId: task.id
                    }
                })
            }
            return res.json(await prisma.task.findFirst({
                where: {
                    id: task.id,
                },
                include: {
                    attachment: true
                }
            }))
            default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb'
        }
    }
}