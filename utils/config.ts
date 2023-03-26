export default {
    cookie_name: process.env.COOKIE_NAME||'UTH_SESS_ID'
} as config

interface config{
    cookie_name: string
}