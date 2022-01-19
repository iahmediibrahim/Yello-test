// eslint-disable-next-line no-unused-vars
import * as express from 'express'

// eslint-disable-next-line prettier/prettier
declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Request {
      user?: Record<string, any>
    }
  }
}
