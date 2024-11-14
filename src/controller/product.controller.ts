import { Request, Response } from 'express'
import * as product from 'model/product.model'


const get = (req: Request, res: Response): Promise<Response> => {
  return product.get(req.query)
    .then(data => res.status(200).json(data))
    .catch(message => res.status(400).json({ message }))
}

const getByTitle = (req: Request<{ title: string }>, res: Response): Promise<Response> => {
  return product.getByTitle(req.params.title)
    .then(data => res.status(200).json(data))
    .catch(message => res.status(400).json({ message }))
}

const getByCategory = (req: Request<{ name: string }>, res: Response): Promise<Response> => {
  return product.getByCategory(req.params.name)
    .then(data => res.status(200).json(data))
    .catch(message => res.status(400).json({ message }))
}

const info = (req: Request, res: Response): Promise<Response> => {
  return product.info(req.query)
    .then(data => res.status(200).json(data))
    .catch(message => res.status(400).json({ message }))
}

const onsale = (req: Request, res: Response): Promise<Response> => {
  return product.onsale()
    .then(data => res.status(200).json(data))
    .catch(message => res.status(400).json({ message }))
}

const search = (req: Request, res: Response): Promise<Response> => {
  return product.search(req.query)
    .then(data => res.status(200).json(data))
    .catch(message => res.status(400).json({ message }))
}

const topSelling = (req: Request, res: Response): Promise<Response> => {
  return product.topSelling()
    .then(data => res.status(200).json(data))
    .catch(message => res.status(400).json({ message }))
}

export { get, info, getByTitle, getByCategory, search, onsale, topSelling }