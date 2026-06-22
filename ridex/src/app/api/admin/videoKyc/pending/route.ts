import { auth } from "@/auth";
import connectDB from "@/lib/db";
import userModel from "@/models/UserModel";

export async function GET(){
    try {
        await connectDB()
        const session = await auth()
        if(!session || !session?.user?.email || session.user.role !== "admin"){
            return Response.json({
                message:"Unauthorized"
            },{status:400})
        }

        const partner = await userModel.find({
            role:"partner",
            partnerOnBoardingSteps:4,
            videoKycStatus:{$in:["pending" ,"in_progress"]}
        })

//         partner.videoKycStatus = "approved"
// partner.partnerOnBoardingSteps = 5
// partner.videoKycRoomId = undefined

// await partner.save()

        return Response.json(
            partner,{status:200}
        )
    } catch (error) {
         return Response.json(
            {message:`Error in get pending kyc ${error}`},{status:500}
        )
    }
}