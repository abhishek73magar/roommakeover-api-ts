import { SECRET_KEY } from 'config/config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWTPayload } from 'types/userTypes'


const generate = (data: JWTPayload, trust?: boolean, expiresIn?: string | number): string => {
  if(!!trust) expiresIn = '30d'
  else if(!expiresIn) expiresIn = '1d'
  const token = jwt.sign({ data }, SECRET_KEY, { expiresIn })
  return token;
}

const verify = (token: string): Promise<string | JwtPayload> => {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, SECRET_KEY, (err, decode) => {
      if(err) return reject(err)
      return resolve(decode as string | JwtPayload)
    })
  })
}

export { generate, verify }