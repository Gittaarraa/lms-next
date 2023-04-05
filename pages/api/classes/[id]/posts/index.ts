import { NextApiRequest, NextApiResponse } from "next";
import appconfig from "@/utils/config";
import { prisma } from "@/utils/prismaConnect";
import { AttachmentBody } from "@/pages/classes/[id]";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import cuid from "cuid";

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
            const { sentence, attachments }: { sentence: string, attachments: AttachmentBody[] } = req.body
            if(!sentence)return res.status(400).json({ message: "text required!" })
            const post = await prisma.post.create({
                data: {
                    sentence,
                    classId: String(req.query.id),
                    writerId: session.user.id,
                }
            })
            for (const attachment of attachments) {
                if(!Array.isArray(attachment.buf))return res.status(400).json({ message: "file is invalid!" })
                const fileKey = `files/post/${String(req.query.id)}/${cuid()}/${attachment.name}`
                if(!existsSync(fileKey.substring(0, fileKey.lastIndexOf('/')))){
                    mkdirSync(fileKey.substring(0, fileKey.lastIndexOf('/')), { recursive: true })
                }
                writeFileSync(fileKey, Buffer.from(Uint8Array.from(attachment.buf)))
                await prisma.postAttachment.create({
                    data: {
                        file: fileKey,
                        postId: post.id
                    }
                })
            }
            return res.json(await prisma.post.findFirst({
                where: {
                    id: post.id,
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