import CryptoJS from 'crypto-js'
import * as dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import ApiError from '../../middleware/ApiError'
import User from '../../models/User'
import { Cors, corsWithOptions } from './cors'
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from './verifyToken'

dotenv.config()

const passSec: string = process.env.PASS_SEC || ''

const usersRouter = express.Router()

// users specified actions, get all users
usersRouter
  .route('/')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(
    Cors,
    verifyTokenAndAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query.new
      try {
        const users = query
          ? await User.find().sort({ _id: -1 }).limit(5)
          : await User.find()
        res.status(200).json(users)
      } catch (error: any) {
        next(ApiError.internal(error.message))
      }
    }
  )

// Get users stats
usersRouter
  .route('/stats')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(
    Cors,
    verifyTokenAndAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
      const date = new Date()
      const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
      try {
        const data = await User.aggregate([
          { $match: { createdAt: { $gte: lastYear } } },
          {
            $project: {
              month: { $month: '$createdAt' }
            }
          },
          {
            $group: {
              _id: '$month',
              total: { $sum: 1 }
            }
          }
        ])

        res.status(200).json(data)
      } catch (error: any) {
        next(ApiError.internal(error.message))
      }
    }
  )
// user specified actions update get delete
usersRouter
  .route('/:id')
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .put(
    Cors,

    verifyTokenAndAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
          req.body.password,
          passSec
        ).toString()
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body
          },
          { new: true }
        )
        res.status(200).json(updatedUser)
      } catch (error: any) {
        next(ApiError.internal(error.message))
      }
    }
  )
  .delete(
    Cors,

    verifyTokenAndAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been deleted.')
      } catch (error: any) {
        next(ApiError.internal(error.message))
      }
    }
  )
  .get(
    Cors,

    verifyTokenAndAdmin,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json({ ...others })
      } catch (error: any) {
        next(ApiError.internal(error.message))
      }
    }
  )

export default usersRouter
