import { auth } from "@/auth"
import uploadOnCloudinary from "@/lib/cloundary"
import connectDB from "@/lib/db"
import userModel from "@/models/UserModel"
import vehicleModel from "@/models/VehicleModel"


export async function POST(req:Request){
    try{
  await connectDB()

        const session = await auth()
        if (!session || !session.user?.email) return new Response("Unauthorized", { status: 401 })

        const partner = await userModel.findOne({ email: session.user.email })
        if (!partner) return new Response("Partner not found", { status: 401 })

        const vehicle = await vehicleModel.findOne({owner:partner._id})
        if(!vehicle){
            return Response.json(
                {message:"Vehicle not found"},{status:400}
            )
        }

        const formdata = await req.formData()

        const image = formdata.get('image') as File | null
        const baseFare = formdata.get('baseFare')
        const pricePerKm = formdata.get('pricePerKm')
        const waitingCharge = formdata.get('waitingCharge')

        let updated = false

        if(image && image.size > 0){
            const imageUrl = await uploadOnCloudinary(image)
            vehicle.imageUrl = imageUrl
            updated = true
        }

        if(baseFare !== null){
            vehicle.baseFare = Number(baseFare)
            updated = true
        }

        if(pricePerKm !== null){
            vehicle.pricePerKm = Number(pricePerKm)
            updated = true
        }

        if(waitingCharge !== null){
            vehicle.waitingCharge = Number(waitingCharge)
            updated = true
        }

        if(updated == false){
             return Response.json(
                {message:"No update needed"},{status:400}
            )
        }

        vehicle.status = "pending"
        vehicle.rejectionReason = undefined
        await vehicle.save()

        partner.partnerOnBoardingSteps = 6
        await partner.save()

         return Response.json(
                {vehicle},{status:200}
            )
        
    }catch(error){
        console.log(error)
        return Response.json(
            {message:"Error in partner onboarding pricing"},{status:500}
        )
    }
}

export async function GET(){
    try {
        await connectDB()

        const session = await auth()
        if (!session || !session.user?.email) return new Response("Unauthorized", { status: 401 })

        const partner = await userModel.findOne({ email: session.user.email })
        if (!partner) return new Response("Partner not found", { status: 401 })

        const vehicle = await vehicleModel.findOne({owner:partner._id})
        if(!vehicle){
            return Response.json(
                {message:"Vehicle not found"},{status:400}
            )
        }

         return Response.json(
            vehicle, {status: 200}
        ) 
    } catch (error) {
       return Response.json(
            {message:"Error in get partner onboarding pricing"},{status:500}
        ) 
    }
}