import { NextApiRequest, NextApiResponse } from "next";
import config from "@/utils/config";
import { prisma } from "@/utils/prismaConnect";
import { createReadStream, existsSync } from "fs";
import path from "path";

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
            try {
                if(!Array.isArray(req.query.key))throw "no keys!!!"
                if(!existsSync(path.join("files/task/",...req.query.key)))throw "File Not Found!"
                return createReadStream(path.join("files/task/",...req.query.key)).pipe(res)
            } catch (error) {
                return res.status(404).json({ message: "file not found!" })
            };
        default:
            return res.status(405).json({ message: req.method+' method is not allowed!' })
    }
}
