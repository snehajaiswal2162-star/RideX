import { NextRequest } from "next/server";
import connectDB from "@/lib/db"
import { auth } from "@/auth";
import userModel from "@/models/UserModel";
import vehicleModel from "@/models/VehicleModel";

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        if (!session || !session.user?.email || session.user?.role !== "admin") {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const totalPartners = await userModel.countDocuments({ role: "partner" })
        const totalPendingPartner = await userModel.countDocuments({ role: "partner", partnerStatus: "pending" })
        const totalApprovedPartner = await userModel.countDocuments({ role: "partner", partnerStatus: "approved" })
        const totalRejectedPartner = await userModel.countDocuments({ role: "partner", partnerStatus: "rejected" })

        const pendingPartnerUsers = await userModel.find({
            role: "partner",
            partnerStatus: "pending",
            partnerOnBoardingSteps: 3
        })

        const partnerIds = pendingPartnerUsers.map((p) => p._id)

        const partnerVehicles = await vehicleModel.find({
            owner: { $in: partnerIds },
        })

        const vehicleTypeMap = new Map(
            partnerVehicles.map((v) => [String(v.owner), v.type])
        )

        const pendingVehicleRaw = await vehicleModel.find({
    status: "pending"
}).populate({
    path: "owner",
    match: {
        partnerStatus: "approved",
        videoKycStatus: "approved"
    }
})

const pendingVehicle = pendingVehicleRaw.filter(
    vehicle => vehicle.owner !== null
)


        const pendingPartnerReviews = pendingPartnerUsers.map((p) => ({
            _id: p._id,
            name: p.name,
            email: p.email,
            vehicleType: vehicleTypeMap.get(String(p._id))

        }))

        console.log("Pending Vehicles:", pendingVehicle)
        return Response.json({
            pendingVehicle,
            stats: {
                totalPartners,
                totalPendingPartner,
                totalApprovedPartner,
                totalRejectedPartner
            },
            pendingPartnerReviews
        }, { status: 200 })
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        return Response.json({ message: "Admin Internal Server Error" }, { status: 500 });
    }
}