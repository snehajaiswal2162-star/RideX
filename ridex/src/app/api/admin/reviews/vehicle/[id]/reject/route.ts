import { auth } from "@/auth"
import connectDB from "@/lib/db"
import userModel from "@/models/UserModel"
import vehicleModel from "@/models/VehicleModel"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user?.email || !session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const {reason} = await req.json()
        const vehicleId = (await context.params).id


        const vehicle = await vehicleModel.findById(vehicleId)
        if (!vehicle) {
            return NextResponse.json({ message: "Vehicle not found" }, { status: 400 })
        }

        vehicle.status = "rejected"
        vehicle.rejectionReason = reason
        await vehicle.save()


        return NextResponse.json(
            {
                vehicle,
            }, { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Vehicle rejection id error ", error },
            { status: 500 }
        )
    }
}