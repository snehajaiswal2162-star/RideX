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
        const vehicleId = (await context.params).id


        const vehicle = await vehicleModel.findById(vehicleId)
        if (!vehicle) {
            return NextResponse.json({ message: "Vehicle not found" }, { status: 400 })
        }

        vehicle.status = "approved"
        vehicle.rejectionReason = undefined
        await vehicle.save()

        const partner = await userModel.findById(vehicle.owner)
        if(!partner){
             return NextResponse.json({ message: "Partner not found" }, { status: 400 })
        }
        partner.partnerOnBoardingSteps = 7
        await partner.save()

        return NextResponse.json(
            {
                vehicle,
            }, { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Vehicle approve id error ", error },
            { status: 500 }
        )
    }
}