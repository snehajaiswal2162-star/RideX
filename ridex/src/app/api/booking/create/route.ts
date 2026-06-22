import { auth } from "@/auth";
import connectDB from "@/lib/db";
import bookingModel from "@/models/bookingModel";
import userModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose'
import axios from 'axios' 

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" }, { status: 401 }
            )
        }
        const user = await userModel.findOne({email:session.user.email})

        const { driverId, vehicleId, pickupLocation, dropLocation, pickupAddress, dropAddress, fare, userMobileNumber } = await req.json()
        if (!driverId  ||   !pickupLocation.coordinates || !dropLocation.coordinates) {
            return NextResponse.json(
                { message: "Missing required details" }, { status: 400 }
            )
        }
        const driver = await userModel.findById(driverId)
        if (!driver) {
            return NextResponse.json(
                { message: "driver not found" }, { status: 400 }
            )
        }

        const existing = await bookingModel.findOne({
            user: user._id,
            bookingStatus: {
                $in: ['requested', 'awaiting_payment', 'confirmed', 'started']
            }
        })
        if (existing) {
            return NextResponse.json(
                existing
            )
        }

        const booking = await bookingModel.create({
            user: user._id,
            driver,
            vehicle: vehicleId,
            pickupLocation,
            dropLocation,
            pickupAddress,
            dropAddress,
            fare,
            userMobileNumber,
            driverMobileNumber: driver.mobileNumber,
            bookingStatus: 'requested'
        })
        return NextResponse.json(
            booking, { status: 200 }
        )
        
        await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_CLOUD_SERVER_SECRET}/emit`,{
            event:'new-booking',
            userId:driverId,
            data:booking
        })
    } catch (error) {
        return NextResponse.json(
            { message: `error in booking create ${error}` }, { status: 500 }
        )
    }
}