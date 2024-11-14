import { AUTH_COOKIE_NAME } from "config/config";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'helpers/jwtToken'
import { AuthenticatedRequest, JWTPayload } from "types/userTypes";


const notAllowGet = ["/user", "/checkout", "/wishlist", "/billingaddress", "/community/user", "/share-product/user", "/order"];
const noAuth = ['/login', '/signin', '/login-with-social', '/blog', '/sendmail', '/category', '/product-images']

const auth = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const url = req.url.split('?')[0]
    if(noAuth.includes(url)) return next()
    if(req.method === 'GET'){
      const check = notAllowGet.some(path => url.includes(path))
      if(!check) return next()
    }

    const authtoken: string | null | undefined = req.cookies[AUTH_COOKIE_NAME]
    if(!!authtoken){
      const decodeToken = await jwt.verify(authtoken)
      if(typeof decodeToken === 'object' && decodeToken !== null){
        req.user = decodeToken.data as JWTPayload
        return next()
      }
    }

    throw new Error("Unauthorized User")  
  } catch (error) {
    if(error instanceof Error) console.log(error.message)
    else console.log(error)
    return res.status(401).json({ message: "Unauthorized User !!"})
  }
}


export default auth;