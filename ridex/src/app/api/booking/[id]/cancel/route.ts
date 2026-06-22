import connectDB from "@/lib/db";
import bookingModel from "@/models/bookingModel";
import { NextRequest, NextResponse } from "next/server";

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

        booking.bookingStatus = 'cancelled'
        await booking.save()
        return NextResponse.json(
                { message: "Booking cancelled successfully" }, { status: 200 }
            )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: `partner booking cancel error ${error}` }, { status: 500 }
        )
    }
}