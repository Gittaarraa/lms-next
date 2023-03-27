import config from "@/utils/config"
import { prisma } from "@/utils/prismaConnect"
import * as argon2 from "argon2";
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
    const { username, password, name, level } = req.body
    const hash = await argon2.hash(password);

    switch(req.method){
        case 'PATCH':
            if(session?.user.level!=='ADMIN') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            return res.json(await prisma.user.update({
                where: {
                    id: Number(req.query.id)
                },
                data: {
                    username: username||undefined,
                    password: hash||undefined,
                    level: level||undefined,
                    name: name||undefined
                }
            }))
        // case'DELETE':
        //     if(session?.user.level!=='ADMIN') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })

        //     const user = await prisma.user.findFirst({
        //         where: {
        //             id: Number(req.query.id)
        //         }
        //     })

        //     if(!user)return res.status(400).json({ message: "invalid user!" })

        //     await prisma.user.delete({
        //         where: {
        //             id: user.id
        //         }
        //     })
        //     return res.status(200).json({ message: "user successfully deleted!" })
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}