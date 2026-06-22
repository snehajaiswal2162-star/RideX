import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import userModel from "@/models/UserModel";
import PartnerDocsModel from "@/models/PartnerDocsModel";
import PartnerBankModel from "@/models/PartnerBankModel";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session || !session?.user?.email || session.user.role !== "admin") {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 400 })
        }

        await connectDB()

        const partnerId = (await context.params).id
        const partner = await userModel.findById(partnerId)

        if (!partner || partner.role !== "partner") {
            return NextResponse.json({
                message: "Partner not found"
            }, { status: 400 })
        }

        if (partner.partnerStatus === "approved") {
            return NextResponse.json({
                message: "Partner already approved"
            }, { status: 400 })
        }

        const partnerDocs = await PartnerDocsModel.findOne({ owner: partner._id })
        const partnerBank = await PartnerBankModel.findOne({ owner: partner._id })

        if (!partnerBank || !partnerDocs) {
            return NextResponse.json({
                message: "partner did not ompleted on boarding step"
            }, { status: 400 })
        }

        partner.partnerStatus = "approved"
        partner.videoKycStatus="pending"
        partner.partnerOnBoardingSteps = 4
        await partner.save()

        partnerDocs.status = "approved"
        await partnerDocs.save()

        partnerBank.status = "verifed"
        await partnerBank.save()


        return NextResponse.json({
            message: "Partner approved successfully"
        }, { status: 201 })
    } 
    catch (error) {
        console.log(error)
        return NextResponse.json({
            message: `Error in approved route ${error}`
        }, { status: 500 })
    }
}