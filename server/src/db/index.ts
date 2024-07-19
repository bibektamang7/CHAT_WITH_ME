import mongoose from "mongoose";
import {DB_NAME} from "../constants"


export const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL);
    
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`) 
  } catch (error) { 
    console.log("Something went wrong while connecting MONGODB");
    process.exit(1);
  }
} 
