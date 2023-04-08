import config from "@/utils/config"
import { prisma } from "@/utils/prismaConnect"
import { NextApiRequest, NextApiResponse } from "next"
import { redirect } from "next/dist/server/api-utils"

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
        case 'GET':
            if(!session?.user.id) return res.status(400).json({ message: 'invalid user' })
            const inviteCode = await prisma.inviteCode.findFirst({
                where: {
                    code: String(req.query.id)
                }
            })
            if(!inviteCode) return res.status(404).json({ redirect: '/classes' })
            const checkUser = await prisma.classMate.findFirst({
                where: { 
                    userId: session.user.id,
                    classId: inviteCode.kelasId
                }
            })
            if(checkUser){
                return res.status(400).json({ message: 'user already in class!' })
            }else{
                await prisma.classMate.create({
                    data: {
                        classId: inviteCode?.kelasId,
                        userId: session?.user.id
                    }
                })
                return res.redirect(`/classes/${inviteCode.kelasId}`)
            }

        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}