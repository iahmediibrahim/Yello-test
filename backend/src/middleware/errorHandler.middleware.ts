import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import ApiError from './ApiError'

const errorHandler: ErrorRequestHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
): void => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  res.status(status).json({ status, message })
}

export default errorHandler
