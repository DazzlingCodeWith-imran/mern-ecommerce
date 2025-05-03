const mongoose= require('mongoose');
require('dotenv').config();


const connectDB=async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI,);
    console.log("Database Connect Successfully");
  } catch (error) {
    console.log("Error Occured in Connecting With Database",error.message);
  }
};
module.exports={
  connectDB,
}
