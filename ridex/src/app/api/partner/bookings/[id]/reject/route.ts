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

        booking.bookingStatus = 'rejected'
        await booking.save()

        await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_CLOUD_SERVER_SECRET}/emit`,{
            event:'reject-booking',
            userId:booking.user,
            data:booking.bookingStatus
        }) 
        return NextResponse.json(
                { message: "Booking rejected successfully" }, { status: 200 }
            )
   
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: `partner booking reject error ${error}` }, { status: 500 }
        )
    }
}