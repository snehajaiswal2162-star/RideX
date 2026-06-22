import bookingModel from "@/models/bookingModel";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import crypto from 'crypto'

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const  { bookingId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json()

console.log({
  bookingId,
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature
})

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET!)
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
        const generated_signature = hmac.digest('hex')

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json(
                { message: 'Invalid signature', success: false }, { status: 400 }
            )
        }

        const booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return NextResponse.json(
                { message: 'bookingnot found', success: false }, { status: 400 }
            )
        }

        const adminCommission = booking.fare * 0.10
        const partnerAmount = booking.fare - adminCommission

        booking.partnerAmount = partnerAmount
        booking.adminCommission = adminCommission

        booking.paymentStatus = 'paid'
        booking.bookingStatus = 'confirmed'

        await booking.save()

        return NextResponse.json(
            { success: true, adminCommission, partnerAmount }, { status: 200 }
        )

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: `api payment verify error ${error}`, success:true }, { status: 500 }
        )
    }
}