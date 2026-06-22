import connectDB from "@/lib/db";
import chatMessageModel from "@/models/chatMessageModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDB()
        const { bookingId, sender, text } = await req.json()

console.log({
  bookingId,
  sender,
  text
})
        
        const msg = await chatMessageModel.create({
            bookingId, text, sender
        })
       return NextResponse.json(
            msg,{status:200}
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message:`api chat send error ${error}`},{status:500}
        )
    }
}