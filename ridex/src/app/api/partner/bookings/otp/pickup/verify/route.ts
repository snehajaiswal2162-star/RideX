import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import bookingModel from "@/models/bookingModel";


export async function POST(req:NextRequest){
    try {
        await connectDB()
        const {bookingId,otp} = await req.json()
        const booking = await bookingModel.findById(bookingId).populate('user')
        if(!booking) {
            return NextResponse.json(
                {message:'booking  not found'},{status:400}
            )
        }

        if(!booking.pickupOtp){
             return NextResponse.json(
                {message:'pickup otp is not generated'},{status:400}
            )
        }

         if(booking.pickupOtp !== otp){
             return NextResponse.json(
                {message:'incorrect pickup otp'},{status:400}
            )
        }

         if(booking.pickupOtpExpires<new Date()){
             return NextResponse.json(
                {message:' otp expired'},{status:400}
            )
        }

        booking.bookingStatus="started"
        booking.pickupOtp=''
        booking.pickupOtpExpires = undefined
        await booking.save()

            return NextResponse.json(
                {message:'pickup otp verifed successfully'},{status:200}
            )
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message:`partner booking otp pickup verify error ${error}`},{status:500}
        )
    }
}