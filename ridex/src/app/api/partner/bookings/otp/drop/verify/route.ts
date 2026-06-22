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

        if(!booking.dropOtp){
             return NextResponse.json(
                {message:'drop otp is not generated'},{status:400}
            )
        }

         if(booking.dropOtp !== otp){
             return NextResponse.json(
                {message:'incorrect drop otp'},{status:400}
            )
        }

         if(booking.dropOtpExpires<new Date()){
             return NextResponse.json(
                {message:' otp expired'},{status:400}
            )
        }

        if(booking.paymentStatus == 'cash' ){
            const adminCommission = booking.fare*0.10
            const partnerAmount = booking.fare - adminCommission
            booking.adminCommission = adminCommission
            booking.partnerAmount = partnerAmount
        }

        booking.paymentStatus="paid"
        booking.bookingStatus="started"
        booking.dropOtp=''
        booking.dropOtpExpires = undefined
        await booking.save()

            return NextResponse.json(
                {message:'drop otp verifed successfully'},{status:200}
            )
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message:`partner booking otp drop verify error ${error}`},{status:500}
        )
    }
}