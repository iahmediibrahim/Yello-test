import * as dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

dotenv.config()

const jwtSec: any = process.env.JWT_SEC
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.headers['x-access-token']

  if (token) {
    jwt.verify(token, jwtSec, (err: any, user: any) => {
      if (err) res.status(403).json('Token is not valid')
      req.user = user
      next()
    })
  } else {
    return res.status(401).json('You are not authenticated!')
  }
}
export const verifyTokenAndAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    console.log(req.params.id, req.user)

    // if (req.user?.id === req.params.id || req.user?.isAdmin) {
    next()
    // } else {
    //   res.status(403).json('You are not allowed to do that!')
    // }
  })
}
export const verifyTokenAndAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin) {
      next()
    } else {
      res.status(403).json('You are not allowed to do that!')
    }
  })
}
