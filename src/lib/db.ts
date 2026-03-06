import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () =>{
  if(isConnected) return;

  const MONGO_URI = process.env.MONGO;
  if(!MONGO_URI){
    throw new Error("MONGO_URI is not defined")
  }
  try{
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("E-webshop database connected successfylly!");
  } catch (err){
    console.error("Error connection to DB", err);
  }
}
export default connectToDB;