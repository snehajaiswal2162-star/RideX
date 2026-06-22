import connectDB from "@/lib/db";
import bookingModel from "@/models/bookingModel";
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }>}
) {
    try {
        const id = (await context.params).id
        await connectDB()

        const booking = await bookingModel.findById(id)
        if (!booking || booking.bookingStatus !== 'requested') {
            return NextResponse.json(
                { message: "Missing required fields" }, { status: 404 }
            )
        }

        booking.bookingStatus = 'awaiting_payment'
        booking.paymentDeadline = new Date(Date.now() + 7*60*1000)
        await booking.save()
        return NextResponse.json(
                { message: "Booking aceepted successfully" }, { status: 200 }
            )

        await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_CLOUD_SERVER_SECRET}/emit`,{
            event:'accept-booking',
            userId:booking.user,
            data:booking.bookingStatus
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: `partner booking accept error ${error}` }, { status: 500 }
        )
    }
}