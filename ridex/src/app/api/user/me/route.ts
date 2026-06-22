import { auth } from "@/auth";
import connectDB from "@/lib/db";
import userModel from "@/models/UserModel";

export async function GET(req: Request){
    try {
        await connectDB()
        const session = await auth()
        if(!session || !session.user ){
            return Response.json(
                {message:"User is not authenitcated"},
                {status:401}
            )
        }

        const user = await userModel.findOne({email:session.user.email})
        if(!user){
            return Response.json(
                {message:"User not found"},
                {status:401}
            )
        }

        return Response.json(
                 user,
                {status:201}
            )

    } catch (error) {
        return Response.json(
                {message:`internal error in me ${error}`},
                {status:501}
            )
    }
}