import { auth } from "@/auth"
import connectDB from "@/lib/db"
import vehicleModel from "@/models/VehicleModel"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        console.log("SESSION IN API:", session)

        if (!session?.user?.email || !session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const vehicleId = (await context.params).id


        const vehicle = await vehicleModel.findById(vehicleId).populate('owner')
        console.log(vehicle)
        if (!vehicle) {
            return NextResponse.json({ message: "Vehicle not found" }, { status: 400 })
        }

        return NextResponse.json(
            {
                vehicle,
            }, { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Vehicle reviews id error ", error },
            { status: 500 }
        )
    }
}