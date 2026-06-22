import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking",
        required:true
    },
    sender:{
        type:String,
        enum:['User', 'Driver'],
        required:true
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true})

const chatMessageModel = mongoose.models.chatMessage ||  mongoose.model("chatMessage", chatMessageSchema)
export default chatMessageModel