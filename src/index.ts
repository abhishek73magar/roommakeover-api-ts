import 'module-alias/register'
import express, { Application } from 'express'
import cors from 'cors'
import './db'
import { PORT } from 'config/config'
import cookieParser from 'cookie-parser'
import origins from 'config/origins'
import logger from 'middleware/logger'
import routes from 'routes/routes'
import auth from 'auth/auth'

const app: Application = express();

app.use(cookieParser())
app.use(cors({ origin: origins, credentials: true }))
app.use(express.json())

app.use(logger) // path log
app.use("/api", auth, routes) // all routes

app.listen(PORT, () => console.log(`server running at ${PORT}`))
