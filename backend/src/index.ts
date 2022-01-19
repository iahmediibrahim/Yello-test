import * as dotenv from 'dotenv'
import express, { Application } from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import path from 'path'
import errorHandler from './middleware/errorHandler.middleware'
import routes from './routes'

dotenv.config()

const mongoUrl: string = process.env.MONGO_URL || ''
mongoose
  .connect(mongoUrl)
  .then(() => console.log('db connection successfull!'))
  .catch((err) => console.log(err))

const PORT = process.env.PORT || 5000
// create an instance server
const app: Application = express()

// HTTP request logger middleware
app.use(morgan('short'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api', routes)

// Error handler middleware
app.use(errorHandler)
// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at port:${PORT}`)
})

export default app
