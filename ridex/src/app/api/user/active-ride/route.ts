import { auth } from "@/auth"
import connectDB from "@/lib/db"
import bookingModel from "@/models/bookingModel"
import userModel from "@/models/UserModel"
import vehicleModel from "@/models/VehicleModel"
import { NextResponse, NextRequest } from "next/server"

export async function POST(req:NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        if(!session || !session?.user?.email){
            return NextResponse.json(
                {message:'Unauthroized'},{status:401}
            )
        }
const {bookingId} = await req.json()

        const booking = await bookingModel.findById(bookingId).populate('user vehicle driver')
console.log('ehicle',vehicleModel)
        return NextResponse.json(
            booking,{status:200}
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message:`api user active-active error ${error}`},{status:500}
        )
    }
}