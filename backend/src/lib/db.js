import mongoose from 'mongoose';

export const connectDB = async () => {
    try 
    {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected : ${conn.connection.host}`);
    }
    catch(Error)
    {
      console.log("Error in connecting the MongoDB", Error);
      process.exit(1);  // 1 means failure
    }
}