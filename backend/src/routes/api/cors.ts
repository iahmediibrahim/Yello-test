import cors from 'cors'
import { Request } from 'express'

const whitelist = ['http://localhost:3000', 'https://localhost:3443']
const corsOptionsDelegate = (req: Request, callback: CallableFunction) => {
  let corsOptions
  const origin: any = req.header('Origin')
  console.log(origin)

  if (whitelist.indexOf(origin) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}
export const Cors = cors()
export const corsWithOptions = cors(corsOptionsDelegate)
