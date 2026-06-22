import { NextRequest } from "next/server";
import connectDB from "@/lib/db"
import { auth } from "@/auth";
import userModel from "@/models/UserModel";
import vehicleModel from "@/models/VehicleModel";


export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { latitude, longitude, vehicleType } = await req.json()
        if (!latitude || !longitude) {
            return Response.json(
                { message: "Coordinates are not found" }, { status: 400 }
            )
        }

        const partners = await userModel.find({
            role: "partner",
            isOnline: true,
            partnerStatus: "approved",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        })
        const partnerIds = partners.map((p) => p._id)
        if (partnerIds.length === 0) {
            return Response.json(
                [], { status: 200 }
            )
        }


        const vehicle = await vehicleModel.find({
            owner: { $in: partnerIds },
            type: vehicleType,
            status: "approved",
            isActive: true
        }).lean()
console.log("Vehicles from API:", vehicle)

        return Response.json(
            vehicle, { status: 200 }
        )

    } catch (error) {
        return Response.json(
            { message: `vehicle nearby error ${error}` }, { status: 500 }
        )

    }
}