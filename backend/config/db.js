import mongoose from 'mongoose'

const connectDB = async ()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('MongoDB connected');
    
  } catch (error) {
    console.error('DB connection failed',error);
    
  }
}

export default connectDB;