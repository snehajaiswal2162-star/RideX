import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import bookingModel from "@/models/bookingModel";
import { sendMail } from "@/lib/sendMail";


export async function POST(req:NextRequest){
    try {
        await connectDB()
        const {bookingId} = await req.json()
        const booking = await bookingModel.findById(bookingId).populate('user')
        if(!booking) {
            return NextResponse.json(
                {message:'booking  not found'},{status:400}
            )
        }

        const otp= Math.floor(1000+Math.random()*9000).toString()
        booking.dropOtp=otp
        booking.dropOtpExpires = new Date(Date.now()+5*60*1000)
        await booking.save()

        if (booking.user.email) {
  await sendMail(
    booking.user.email,
    "Your Drop OTP - RYDEX",
    `
    <div style="font-family:sans-serif;padding:20px">
      <h2>Ride OTP</h2>

      <p>Your Drop OTP is:</p>

      <h1 style="letter-spacing:6px">${otp}</h1>

      <p>This OTP is valid for 5 minutes.</p>

      <p>Share this OTP with your driver to end the ride.</p>

      <br/>

      <b>RYDEX</b>
    </div>
    `
  )
}

            return NextResponse.json(
                {message:'drop otp send successfully'},{status:200}
            )
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message:`partner booking otp drop send error ${error}`},{status:500}
        )
    }
}