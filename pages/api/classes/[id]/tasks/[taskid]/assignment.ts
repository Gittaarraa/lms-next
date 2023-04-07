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

    const task = await prisma.task.findFirst({
        where: {
            id: String(req.query.taskid)
        },
        include: {
            Kelas: {
                include: {
                    users: {
                        select: {
                            userId: true
                        }
                    }
                }
            }
        }
    })

    switch(req.method){
        case'POST':
            if(!session?.userId||!task?.Kelas?.users.map(students=>students.userId).includes(session?.userId)) return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            const { text, attachments }: { attachments: AttachmentBody[], text: string } = req.body
            if(!text)return res.status(400).json({ message: "text is required!" })
            const assignment = await prisma.taskAssignment.create({
                data: {
                    text,
                    taskId: String(req.query.taskid),
                    userId: session.userId
                }
            })
            for (const attachment of attachments) {
                if(!Array.isArray(attachment.buf))return res.status(400).json({ message: "file is invalid!" })
                const fileKey = `files/assigment/${assignment.id}/${cuid()}/${attachment.name}`
                if(!existsSync(fileKey.substring(0, fileKey.lastIndexOf('/')))){
                    mkdirSync(fileKey.substring(0, fileKey.lastIndexOf('/')), { recursive: true })
                }
                writeFileSync(fileKey, Buffer.from(Uint8Array.from(attachment.buf)))
                await prisma.assignmentAttachment.create({
                    data: {
                        file: fileKey,
                        assignmentId: assignment.id
                    }
                })
            }
            return res.json(await prisma.taskAssignment.findFirst({
                where: {
                    id: assignment.id,
                },
                include: {
                    attachment: true,
                    Task: true
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