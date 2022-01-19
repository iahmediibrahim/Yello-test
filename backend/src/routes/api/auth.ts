import axios from 'axios'
import CryptoJS from 'crypto-js'
import * as dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import ApiError from '../../middleware/ApiError'
import Post from '../../models/Post'
import User from '../../models/User'
import { Cors, corsWithOptions } from './cors'

dotenv.config()

const authRouter = express.Router()
const passSec: string = process.env.PASS_SEC || ''
const jwtSec: any = process.env.JWT_SEC

// REGISTER
authRouter
  .route('/register')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .post(Cors, async (req: Request, res: Response, next: NextFunction) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(req.body.password, passSec).toString()
    })
    try {
      const user = await newUser.save()
      res.status(201).json(user)
    } catch (error: any) {
      next(ApiError.internal(error.message))
    }
  })
// LOGIN
authRouter
  .route('/login')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .post(Cors, async (req: Request, res: Response, next: NextFunction) => {
    const { username, password: prvidedPassword } = req.body
    try {
      const user = await User.findOne({
        username
      })
      !user && res.status(401).json('Wrong credentials')
      const userPassword = CryptoJS.AES.decrypt(
        user.password,
        passSec
      ).toString(CryptoJS.enc.Utf8)

      userPassword !== prvidedPassword &&
        res.status(401).json('Wrong credentials')

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin
        },
        jwtSec,
        { expiresIn: '3d' }
      )
      const { password, ...others } = user._doc

      const posts = await Post.find({
        userId: user.id
      })
      console.log(typeof posts)

      if (
        posts && // 👈 null and undefined check
        Object.keys(posts).length === 0
      ) {
        console.log('no user posts')
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/posts?userId=${user._id}`
        )
        const resData = response.data

        // eslint-disable-next-line no-restricted-syntax
        for (const post of resData) {
          const newPost = new Post(post)
          // eslint-disable-next-line no-await-in-loop
          await newPost.save()
        }
      }
      res.status(200).json({ ...others, accessToken })
    } catch (error: any) {
      next(ApiError.internal(error.message))
    }
  })
export default authRouter
