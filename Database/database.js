import mongoose from "mongoose";


export const database=async()=>{

    try {
        await   mongoose.connect(process.env.DB_CONNECTION)
        console.log("Database are Connected SuccessFully")
        
    } catch (error) {
        console.log("Database are Not  Connected !!")

    }
}