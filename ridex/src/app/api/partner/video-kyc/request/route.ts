import { auth } from "@/auth"
import connectDB from "@/lib/db"
import userModel from "@/models/UserModel"

export async function GET(){
    try{
 await connectDB()

        const session = await auth()
        if (!session || !session.user?.email) return new Response("Unauthorized", { status: 401 })

        const partner = await userModel.findOne({ email: session.user.email })
        if (!partner) return new Response("Partner not found", { status: 401 })

         if(partner.videoKycStatus !== "rejected"){
            return Response.json(
                {message:"You can not send kyc request at this time"},{status:400}
            )
         }
         
         partner.videoKycStatus = "pending"
         partner.videoKycRejectionReason = undefined
         partner.videoKycRoomId = undefined
         await partner.save()
         return Response.json({success:true},{status:200})
    }catch(error){
        return Response.json("Partner kyc  Error", { status: 500 })
    }
}