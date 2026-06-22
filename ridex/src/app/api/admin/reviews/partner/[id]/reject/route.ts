import { auth } from "@/auth";
import connectDB from "@/lib/db";
import userModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session || !session?.user?.email || session.user.role !== "admin")
            return NextResponse.json({
                message: "UNauthorized"
            }, { status: 400 })

            await connectDB()

            const rejectionReason = await req.json()

        const partnerId = (await context.params).id
        const partner = await userModel.findById(partnerId)
        if(!partner || partner.role !== "partner"){
            return NextResponse.json({
                message:"Partner not found"
            },{status:400})
        }

         partner.partnerStatus = "rejected"
         partner.rejectionReason = rejectionReason
        await partner.save()

        return NextResponse.json({
            message:"Partner Rejected Successfully"
        },{status:201})

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: `Error in rejection of partner ${error}`
        }, { status: 500 })
    }
}