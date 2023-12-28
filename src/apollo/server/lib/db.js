import mongoose from 'mongoose'

const connectDB = async () => {
  if (mongoose.connections[0].readyState !== 1) {
    await mongoose
      .connect(process.env.DB)
      .then(() => console.log('db connected successfully'))
      .catch(err => console.log('db connection Error = ', err))
  }
}

export const connectDBHandler = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState !== 1) {
    console.log("not connected")
    await mongoose
      .connect(process.env.DB)
      .then(() => console.log('db connected successfully'))
      .catch(err => console.log('db connection Error = ', err))
  }

  return handler(req, res)
}


const db = mongoose.connection
db.once('ready', () => console.log(`connected to mongo on ${DB}`))

export default connectDB
