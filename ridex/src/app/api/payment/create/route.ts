import bookingModel from "@/models/bookingModel";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import razorpay from "@/lib/razorpay";

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { bookingId } = await req.json()
        const booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return NextResponse.json(
                { message: "booking not found" }, { status: 400 }
            )
        }

        const order = await razorpay.orders.create({
            amount: booking.fare * 100,
            currency: "INR",
            receipt: booking._id.toString()
        })

        booking.bookingStatus = 'awaiting_payment'
        await booking.save()

        return NextResponse.json(
            {
                order: order.id,
                amount: order.amount
            }, { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: `api payment create error ${error}` }, { status: 500 }
        )
    }
}