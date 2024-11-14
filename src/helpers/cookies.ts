import { Response } from "express";
import moment from 'moment'

const set = (res: Response, name: string, value: string, expired?: number) => {
  if(!expired) expired = moment(0).add(1, 'day').valueOf() // for default expired time in miliseconds
  return res.cookie(name, value, {
    maxAge: expired,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none'
  })
} 

export { set }