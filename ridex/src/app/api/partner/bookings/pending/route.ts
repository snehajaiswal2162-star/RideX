import { auth } from "@/auth";
import connectDB from "@/lib/db";
import bookingModel from "@/models/bookingModel";
import userModel from "@/models/UserModel";

export async function GET(req: Request) {
  try {
    await connectDB();

    const session = await auth();

    if (!session || !session.user) {
      return Response.json(
        { message: "User is not authenticated" },
        { status: 401 }
      );
    }

    const partner = await userModel.findOne({
      email: session.user.email,
    });

    if (!partner) {
      return Response.json(
        { message: "Partner not found" },
        { status: 404 }
      );
    }
    
    const bookings = await bookingModel.find({
        driver:partner._id,
        bookingStatus:'requested'
    })
    return Response.json(
        bookings,
        { status: 200 }
      );
  } catch (error) {
    console.error(error);
    return Response.json(
        {message:`pending partner error ${error}`},{status:500}
    )
  }
}