import { auth } from "@/auth";
import connectDB from "@/lib/db";
import PartnerBankModel from "@/models/PartnerBankModel";
import PartnerDocsModel from "@/models/PartnerDocsModel";
import userModel from "@/models/UserModel";
import vehicleModel from "@/models/VehicleModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req:NextRequest,
    context:{params:Promise<{id:string}>}
){
    try {
        
        const session = await auth()
        
        if(!session?.user?.email || !session || session.user.role !== 'admin'){
            return NextResponse.json({message:"Unauthorized"}, {status:401})
        }

        await connectDB()
        const partnerId = (await context.params).id

    
        const partner = await userModel.findById(partnerId)
console.log(partner)
        if(!partner ){
            return NextResponse.json({message:"Partner not found"}, {status:400})
        }

        const vehicle = await vehicleModel.findOne({owner:partnerId})
        const partnerDocs = await PartnerDocsModel.findOne({owner:partnerId})
        const partnerBank = await PartnerBankModel.findOne({owner:partnerId})

        return NextResponse.json(
            {
                partner,
                vehicle: vehicle || null,
                partnerDocs: partnerDocs || null,
                partnerBank: partnerBank || null
            },{status:201}
        )
    } catch (error) {
        return NextResponse.json(
            {message:"Partner reviews id error ", error},
            {status:500}
        )
    }
}