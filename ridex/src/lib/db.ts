import mongoose from "mongoose"

const mongoUrl = process.env.MONGO_URL

if(!mongoUrl) throw new Error ("DB URL NOT FOUND")

let cached = global.mongooConn 
if(!cached) {
    cached = global.mongooConn = {conn: null, promise: null}
}

const connectDB = async () => {
    if(cached.conn) return cached.conn
    if(!cached.promise){
        cached.promise = mongoose.connect(mongoUrl).then(c => c.connection)
    }

    try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.log("DB CONNECTION ERROR", error);
    throw error;
  }
}

export default connectDB