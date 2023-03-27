import * as argon2 from "argon2";
import { NextApiRequest, NextApiResponse } from "next";
import config from "../../../utils/config";
import { prisma } from '../../../utils/prismaConnect';
import { nanoid } from "nanoid";
import dayjs from "dayjs";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch(req.method){
        case'POST':
            const { username, password } = req.body
            if(!username||!password)return res.status(400).json({ message: "username & password required!" })

            const user = await prisma.user.findFirst({
                where: { username: username }
            })
            if(!user)return res.status(400).json({ message: "user doesnt exist" })
            if(!await argon2.verify(user.password, password))return res.status(401).json({ message: "wrong password" })
            const sessionId = nanoid(36)
            const expDate = dayjs(new Date()).add(5, 'hours').toDate()
            await prisma.session.create({
                data: {
                    userId: user.id,
                    token: sessionId,
                    expire: expDate
                }
            })
            res.setHeader('Set-Cookie', `${config.cookie_name}=${sessionId}; path=/; expires=${expDate.toUTCString()}; SameSite=Strict; HttpOnly`)
            return res.json({ message: 'successfully logged in!' })
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
