import { Request, Response } from 'express'
import * as user from 'model/user.model'
import { AuthenticatedRequest } from 'types/userTypes'

const signup = (req: Request, res: Response): Promise<Response> => {
  return user.signup(req.body, res)
    .then((data) => res.status(201).json(data))
    .catch(message => res.status(400).json({ message }))
}

const login = (req: Request, res: Response): Promise<Response> => {
  return user.login(req.body, res)
    .then((data) => res.status(200).json(data))
    .catch(message => res.status(400).json({ message }))
}

const loginWithSocial = (req: Request, res: Response): Promise<Response> => {
  return user.loginWithSocial(req.body, res)
    .then((data) => res.status(200).json(data))
    .catch(message => res.status(400).json({ message }))
}

const logout = (req: Request, res: Response): Promise<Response> => {
  return user.logout(res)
    .then((data) => res.status(200).json({ message: data }))
    .catch(message => res.status(400).json({ message }))
}

const updateBio = async(req: AuthenticatedRequest, res: Response): Promise<Response> => {
  return user.updateBio(req.body, req.user)
    .then((data) => res.status(200).json(data[0]))
    .catch(err => {
      if(err instanceof Error) return res.status(400).json({ message: err.message })
      return res.status(400).json({ message: err })
    })
}

const update = async(req: AuthenticatedRequest, res: Response): Promise<Response> => {
  return user.update(req.body, req.user)
    .then((data) => res.status(200).json(data))
    .catch((message) => res.status(400).json({ message }))
}

const get = async(req: AuthenticatedRequest, res: Response): Promise<Response> => {
  return user.get(req.user)
    .then(data => res.status(200).json(data))
    .catch(err => {
      if(err instanceof Error) return res.status(400).json({ message: err.message })
      return res.status(400).json({ message: err })
    })
}


export { signup, login, loginWithSocial, logout, updateBio, update, get }