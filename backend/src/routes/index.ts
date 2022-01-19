import express from 'express'
import authRouter from './api/auth'
import PostsRouter from './api/post'
import usersRouter from './api/user'

const routes = express.Router()

routes.use('/auth', authRouter)
routes.use('/users', usersRouter)
routes.use('/posts', PostsRouter)
export default routes
