import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import Inc from 'mongoose-sequence'

dotenv.config()
const mongoUrl: string = process.env.MONGO_URL || ''

const connection: any = mongoose.createConnection(mongoUrl)

const AutoIncrement: any = Inc(connection)
const UserSchema = new mongoose.Schema(
  {
    _id: Number,
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    _id: false
  }
)

UserSchema.plugin(AutoIncrement)

export default mongoose.model('User', UserSchema)
