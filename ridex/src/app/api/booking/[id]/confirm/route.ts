import { NextAuthRequest } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import bookingModel from "@/models/bookingModel";

export async function GET(
     req: NextRequest,
        context: { params: Promise<{ id: string }>}
) {
    try {
        await connectDB()
        const bookingId =(await context.params).id

        const booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return NextResponse.json(
                { message: 'booking not found', success: false }, { status: 400 }
            )
        }
        booking.paymentStatus = 'cash'
        booking.bookingStatus = 'confirmed'

        await booking.save()

        return NextResponse.json(
            { success: true }, { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: `partner booking id confirm error ${error}` }, { status: 500 }
        )
    }
}