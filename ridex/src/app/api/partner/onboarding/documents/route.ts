import { auth } from "@/auth"
import uploadOnCloudinary from "@/lib/cloundary"
import connectDB from "@/lib/db"
import PartnerDocsModel from "@/models/PartnerDocsModel"
import userModel from "@/models/UserModel"

export async function POST(req: Request) {
    try {
        await connectDB()

        const session = await auth()
        if (!session || !session.user?.email) return new Response("Unauthorized", { status: 401 })

        const user = await userModel.findOne({ email: session.user.email })
        if (!user) return new Response("User not found", { status: 401 })

        const formdata = await req.formData()
        const aadhar = formdata.get("aadhar") as Blob | null
        const license = formdata.get("license") as Blob | null
        const rc = formdata.get("rc") as Blob | null

        if (!aadhar || !license || !rc) {
            return Response.json(
                { message: "Missing required documents" },
                { status: 400 }
            )
        }

        const updatePayload: any = {
            status: "pending"
        }
        if (aadhar) {
            const url = await uploadOnCloudinary(aadhar)
            if (!url) return Response.json("Aadhar upload failed", { status: 500 })
            updatePayload.aadharUrl = url
        }

        if (license) {
            const url = await uploadOnCloudinary(license)
            if (!url) return Response.json("License upload failed", { status: 500 })
            updatePayload.licenseUrl = url
        }

        if (rc) {
            const url = await uploadOnCloudinary(rc)
            if (!url) return Response.json("RC upload failed", { status: 500 })
            updatePayload.rcUrl = url
        }

        const partnerDocs = await PartnerDocsModel.findOneAndUpdate(
            { owner: user._id },
            { $set: updatePayload },
            { upsert: true, new: true }
        )

        if (user.partnerOnBoardingSteps < 2) {
            user.partnerOnBoardingSteps = 2
        }else{
            user.partnerOnBoardingSteps = 3
        }
        await user.save()

        return Response.json(partnerDocs, { status: 200 })

    } catch (error) {
        return Response.json("Partner Docs Error", { status: 500 })
    }
}