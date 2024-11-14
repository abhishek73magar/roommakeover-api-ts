import Knex from "db";
import { Response } from "express"
import { compareHash, generateHash } from "helpers/passwordHash";
import { uid } from "uid"
import * as jwt from 'helpers/jwtToken'
import * as cookie from 'helpers/cookies'
import { AUTH_COOKIE_NAME } from "config/config";
import moment from "moment";
import generator from 'generate-password-ts'
import { JWTPayload, Login, ResponseUser, Token, UpdateUser, UserBody, Users } from "types/userTypes";

const expireToken = moment().add(7, 'days').unix() // seconds sinces 1970
const expireCookie = moment(0).add(7, 'days').valueOf() // miliseconds only

const signup = async(body: UserBody, res: Response): Promise<Token> => {
  try {
    const { email } = body;
    const id = uid(16)  
    
    const [check] = await Knex<Users>('users').where({ email })
    if(!!check) throw new Error("Email already exist !!")
    if(!body.password) throw new Error("Password is required !!")
    const password = await generateHash(body.password)
    Object.assign(body, { id, password })

    const [user] = await Knex<Users>('users').insert(body).returning('*')
    const { firstname, lastname, email: userEmail } = user;
    const token = jwt.generate({ id, firstname, lastname, email: userEmail }, false, expireToken)
    cookie.set(res, AUTH_COOKIE_NAME, token, expireCookie)

    return { token }
  } catch (error) {
    if(error instanceof Error) return Promise.reject(error.message)
    return Promise.reject(error)
  }
}


const login = async(body: Login, res: Response): Promise<Token> => {
  try {
    const { email, password } = body;
    if(!email || email === '') throw new Error("Invalid Email !!")
    const [user] = await Knex<Users>('users').where({ email })
    if(!!user) {
      const checkHash = await compareHash(password, user.password)
      if(!!checkHash){
        const { firstname, lastname, email, id } = user;
        const token = jwt.generate({ id, firstname, lastname, email }, false, expireToken)
        cookie.set(res, AUTH_COOKIE_NAME, token, expireCookie)
        
        return { token }
      }
    }
    throw new Error("Invalid User")
  } catch (error) {
    if(error instanceof Error) return Promise.reject(error.message)
    return Promise.reject(error)
  }
}

const loginWithSocial = async(body: UserBody, res: Response): Promise<Token> => {
  try {
    let [user] = await Knex<Users>('users').where({ email: body.email })
    if(!user) {
      const id = uid(16)
      const genPwd = generator.generate({ length: 10, numbers: true })
      const password = await generateHash(genPwd)
      Object.assign(body, { id, password })

      const [client] = await Knex<Users>('users').insert(body).returning('*')
      user = client;
    }

    const { firstname, lastname, email, id } = user;
    const token = jwt.generate({ id, firstname, lastname, email }, false, expireToken)
    cookie.set(res, AUTH_COOKIE_NAME, token, expireCookie)
    return { token }

  } catch (error) {
    if(error instanceof Error) return Promise.reject(error.message)
    return Promise.reject(error)
  }
}

const logout = (res: Response): Promise<string> => {
  return new Promise((resolve) => {
    res.clearCookie(AUTH_COOKIE_NAME)
    return resolve("Logout successfully !!")
  })
}


const get = (user: JWTPayload | undefined): Promise<ResponseUser | null> => {
  if(!user || !user.id) return Promise.reject("User Not Found !!")
  return Knex<ResponseUser>('users').where({ id: user.id }).first()
    .then((res) => {
      if(!!res){
        delete res.password
        return res as ResponseUser
      }
      return null;
    })
}

const update = async(body: UpdateUser, user: JWTPayload | undefined): Promise<ResponseUser> => {
  try {
    if(!user || !user.id) throw new Error("User Not found !!")

    if(!!body.password && body.password !== ''){
      body.password = await generateHash(body.password) // generate hash & change password !!
    } else delete body.password

    const [response] = await Knex<ResponseUser>('users').where({ id: user.id }).update(body).returning('*')
    if(!!response) delete response.password
    return response
  } catch (error) {
    if(error instanceof Error) return Promise.reject(error.message)
    return Promise.reject(error)
  }
}

type Bio = {
  bio: string
}
const updateBio = (body: Bio, user: JWTPayload | undefined) => {
  if(!user || !user.id) return Promise.reject(new Error("User Not found !!"))
  if(!body || !body.hasOwnProperty('bio')) return Promise.reject(new Error("Bio Not Found !!"))
  return Knex<Users>('users').where({ id: user.id }).update({ bio: body.bio }).returning('bio')
}



export { signup, login, loginWithSocial, logout, get, updateBio, update }
