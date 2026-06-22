import { auth } from "@/auth"
import connectDB from "@/lib/db"
import bookingModel from "@/models/bookingModel"
import userModel from "@/models/UserModel"
import vehicleModel from "@/models/VehicleModel"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        await connectDB()
        const session = await auth()
        if(!session || !session?.user?.email){
            return NextResponse.json(
                {message:'Unauthroized'},{status:401}
            )
        }

        const user = await userModel.findOne({email:session?.user?.email})
        if (!user) {
            return NextResponse.json(
                { message: 'Driver profile not found' }, 
                { status: 404 }
            )
        }

        const booking = await bookingModel.find({
            driver:user._id,
            bookingStatus:{$in:['confirmed', 'started']}
        }).populate('user vehicle driver')

        console.log("Driver ID:", user._id)
console.log("Bookings:", booking)
console.log('vehicleMoel', vehicleModel)


        if (!booking || booking.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(
            booking,{status:200}
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message:`api partner my-active error ${error}`},{status:500}
        )
    }
}