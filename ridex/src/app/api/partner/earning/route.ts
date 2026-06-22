import connectDB from "@/lib/db"
import bookingModel from "@/models/bookingModel"

export async function GET() {
    try {
        await connectDB()

        const sevenDays = new Date()
        sevenDays.setDate(sevenDays.getDate() - 7)

        const bookings = await bookingModel.find({
            paymentStatus: 'paid',
            createdAt: { $gte: sevenDays }
        }).select('partnerAmount  createdAt')

let earning:Record<string,number>={}

bookings.forEach(b => {
    const date = new Date(b.createdAt).toLocaleDateString('en-IN',{
        day:'2-digit',
        month:'short',
    })

    if(!earning[date]){
        earning[date] = 0
    }

    earning[date] = earning[date] + b.partnerAmount || 0
})

        const earnings = Object.entries(earning).map(([date, amount]) => ({
            date,
            earnings: amount
        }))

        return Response.json(earnings, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ message: `api partner earning error ${error}` }, { status: 500 })
    }
}