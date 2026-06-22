import { auth } from "@/auth";
import connectDB from "@/lib/db";
import bookingModel from "@/models/bookingModel";
import userModel from "@/models/UserModel";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const session = await auth()

    if (!session || !session.user?.id) {
      return Response.json(
       {booking:null}
      );
    }

    const user = await userModel.findOne({
      email: session.user.email,
    });

    if (!user) {
      return Response.json(
        { message: "user not found" },
        { status: 404 }
      );
    }

    const booking = await bookingModel.findOne({
      user: user._id,
      bookingStatus:{$in:['requested', 'awaiting_payment', 'confirmed', 'started']}
    })
    if (!booking) {
      return Response.json(
      {booking:"idle"}
      );
    }

    return Response.json(
      {booking},
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: `api booking active error ${error}` }, { status: 500 }
    )
  }
}