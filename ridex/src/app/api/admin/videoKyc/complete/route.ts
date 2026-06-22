import { auth } from "@/auth";
import connectDB from "@/lib/db";
import userModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session || !session?.user?.email || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" }, { status: 400 }
            )
        }

        await connectDB()

        const { roomId, action, reason } = await req.json()

        if (!roomId) {
            return NextResponse.json(
                { message: "RoomId is required" }, { status: 400 }
            )
        }

        if (!["approved", "rejected"].includes(action)) {
            return NextResponse.json(
                { message: "Action is invalid" }, { status: 400 }
            )
        }

        const partner = await userModel.findOne({
            videoKycRoomId: roomId,
            role: "partner"
        })

        if (!partner) {
            return NextResponse.json(
                { message: "Partner not found" }, { status: 400 }
            )
        }

        if (action === "approved") {
            partner.videoKycStatus = "approved"
            partner.videoKycRejectionReason = undefined
            partner.partnerOnBoardingSteps = 5
        }

        if (action === "rejected") {
            if (!reason) {
                return NextResponse.json(
                    { message: "Rejection reason is required" }, { status: 400 }
                )
            }
            partner.videoKycStatus = "rejected"
            partner.videoKycRejectionReason = reason.trim()
        }

        await partner.save()

        return NextResponse.json(
            { message: "Video Kyc Approved successfully" }, { status: 200 }
        )

    } catch (error) {
        console.log("Error in admin complete", error)
        return NextResponse.json(
            { message: "Error in admin complete route" }, { status: 500 }
        )
    }
}
