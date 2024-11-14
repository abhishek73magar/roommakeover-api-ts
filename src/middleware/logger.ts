import { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const url = req.url.split('?')[0]
  console.log(req.method, '-', url, '-', new Date())
  if(Object.keys(req.query).length > 0) console.log(req.query)
  return next();
}

export default logger