import connectDB from "@/lib/db";
import chatMessageModel from "@/models/chatMessageModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDB()
        const {bookingId} = await req.json()
        
        const msgs = await chatMessageModel.find({
            bookingId, 
        })
        return NextResponse.json(
            msgs,{status:200}
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message:`api chat get-all error ${error}`},{status:500}
        )
    }
}