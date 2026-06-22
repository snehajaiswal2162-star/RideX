import { auth } from "@/auth";
import connectDB from "@/lib/db";
import bookingModel from "@/models/bookingModel";
import userModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        await connectDB()
        const session = await auth()
        if(!session || !session.user?.id){
            return NextResponse.json(
                {message:'Unauthroized'},{status:400}
            )
        }
        const driver= await userModel.findOne({email:session.user.email})

        const booking = await bookingModel.find({driver:driver._id}).populate('user driver vehicle').sort({createdAt:-1})
        return NextResponse.json(
                booking,{status:200}
            )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message:`api partner bookings ${error}`},{status:500}
        )
    }
}