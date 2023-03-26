import { NextApiRequest, NextApiResponse } from "next"
import config from "../../../utils/config"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Set-Cookie', `${config.cookie_name}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    if(req.query?.to){
        return res.redirect(String(req.query?.to))
    }
    return res.redirect('/login')
}