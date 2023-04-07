import { NextApiRequest, NextApiResponse } from "next";
import config from "../../../utils/config";
import { prisma } from '../../../utils/prismaConnect'

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const token = req.cookies[config.cookie_name]
    switch(req.method){
        case'GET':
            if(!token) return res.json({})
            const session = await prisma.session.findFirst({
                where: {
                    token
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            level:true,
                            name: true,
                            updatedAt: true,
                            createdAt: true,
                            classMates: {
                                include: {
                                    class: true
                                }
                            }
                        }
                    }
                }
            })
            return res.json(session)
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
