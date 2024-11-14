import * as dotenv from 'dotenv'
dotenv.config()

const PORT =  process.env.PORT ?? 7001
const DB_URL = process.env.DB_URL
const SECRET_KEY = process.env.SECRET_KEY ?? 'SECRET_KEY'
const AUTH_COOKIE_NAME = 'authtoken'

export {
  PORT, DB_URL, SECRET_KEY, AUTH_COOKIE_NAME
}