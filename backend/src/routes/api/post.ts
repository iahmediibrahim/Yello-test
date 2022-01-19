import express, { NextFunction, Request, Response } from 'express'
import ApiError from '../../middleware/ApiError'
import Post from '../../models/Post'
import { Cors, corsWithOptions } from './cors'
import { verifyTokenAndAuthorization } from './verifyToken'

const PostsRouter = express.Router()

// posts specified actions, get all posts
PostsRouter.route('/')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .post(
    Cors,
    verifyTokenAndAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
      const newpost = new Post(req.body)
      try {
        const savedpost = await newpost.save()
        res.status(200).json(savedpost)
      } catch (error: any) {
        next(ApiError.internal(error.message))
      }
    }
  )
  .get(Cors, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await Post.find()
      res.status(200).json(posts)
    } catch (error: any) {
      next(ApiError.internal(error.message))
    }
  })

// post specified actions update get delete
PostsRouter.route('/:id')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .put(
    Cors,

    verifyTokenAndAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const updatedpost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body
          },
          { new: true }
        )
        res.status(200).json(updatedpost)
      } catch (error: any) {
        next(ApiError.internal(error.message))
      }
    }
  )
  .delete(
    Cors,
    verifyTokenAndAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
      console.log(req.params.id, req.user)

      try {
        await Post.findByIdAndDelete(req.params.id)
        const posts = await Post.find()
        res.status(200).json(posts)
      } catch (error: any) {
        next(ApiError.internal(error.message))
      }
    }
  )
  .get(Cors, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await Post.findById(req.params.id)
      res.status(200).json(post)
    } catch (error: any) {
      next(ApiError.internal(error.message))
    }
  })
export default PostsRouter
