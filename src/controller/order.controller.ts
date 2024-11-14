import { Request, Response } from 'express'
import * as order from 'model/order.model'
import { AuthenticatedRequest } from 'types/userTypes'

const create = (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  return order.create(req.body, req.user)
    .then((result) => res.status(201).json(result))
}

const get = (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  return order.get(req.user)
    .then((result) => res.status(200).json(result))
    .catch(message => res.status(400).json({ message }))
}

const getByCollectionId = (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  return order.getByCollectionId(req.params.collection_id, req.user)
    .then((result) => res.status(200).json(result))
    .catch(message => res.status(400).json({ message }))
}



export { create, get, getByCollectionId }