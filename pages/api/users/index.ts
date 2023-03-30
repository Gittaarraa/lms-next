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

    switch(req.method){
        case'POST':
            if(session?.user.level!=='ADMIN') return res.status(403).json({ message: 'you dont have the privilege to do this action!' })
            if(!username||!password||!name||!level)return res.status(400).json({ message: "username, password, name, and level required!" })
            //excel
            const checkUser = await prisma.user.findFirst({
                where: { username: username }
            })
            if(checkUser){
                return res.status(400).json({ message: 'username already in use!' })
            }else{
                await prisma.user.create({
                    data: {
                        username,
                        password: await argon2.hash(password),
                        name,
                        level,
                    }
                })
                return res.status(200).json({ 
                    message: 'user added successfully!'
                })
            }
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}