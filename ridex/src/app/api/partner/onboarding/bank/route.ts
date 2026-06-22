import { auth } from "@/auth"
import connectDB from "@/lib/db"
import PartnerBankModel from "@/models/PartnerBankModel"
import userModel from "@/models/UserModel"

export async function POST(req: Request) {
    try {
        await connectDB()
        const session = await auth()

        if (!session || !session.user?.email) return Response.json({ message: "Unauthorized" }, { status: 401 })
        console.log(session.user.email)

        const user = await userModel.findOne({ email: session.user.email })
        if (!user) return Response.json({ message: "User not found" }, { status: 401 })

        const { accountHolder, accountNumber, mobileNumber, ifsc, upi } = await req.json()
        if (!accountHolder || !accountNumber || !mobileNumber || !ifsc) {
            return Response.json({ message: "Missing required fields" }, { status: 400 })
        }

        const partnerBank = await PartnerBankModel.findOneAndUpdate(
            { owner: user._id },
            {
                accountHolder, accountNumber, ifsc, upi, mobileNumber, status: "added"
            },
            { upsert: true, new: true }
        )

        user.mobileNumber = mobileNumber


            user.partnerOnBoardingSteps = 3

        await user.save()

        return Response.json({ partnerBank }, { status: 200 })
    } catch (error) {
        return Response.json({ message: `Bank Error ${error}` }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        await connectDB()

        const session = await auth()
        console.log("ssss", session)
        if (!session || !session.user?.email) return Response.json({ message: "Unauthorized" }, { status: 401 })
        console.log(session.user.email)

        const user = await userModel.findOne({ email: session.user.email })
        if (!user) return Response.json({ message: "User not found" }, { status: 401 })

        const partnerBank = await PartnerBankModel.findOne({ owner: user._id })
        return Response.json(
    {
        partnerBank,
        mobileNumber: user.mobileNumber || ""
    },
    { status: 200 }
)
        // if (partnerBank) {
        //     return Response.json({ partnerBank, mobileNumber: user.mobileNumber }, { status: 200 })
        // }
    } catch (error) {
        return Response.json({ message: `Bank Error ${error}` }, { status: 500 })
    }
}