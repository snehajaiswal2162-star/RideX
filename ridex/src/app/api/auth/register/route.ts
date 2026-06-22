import connectDB from "@/lib/db";
import userModel from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import { sendMail } from "@/lib/sendMail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if(!email || !name || !password ){
      return NextResponse.json(
        {message:"All field are required"}, {status:401}
      )
    }

    await connectDB();

    let user = await userModel.findOne({ email });

    if (user && user.isEmailVerified) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000+Math.random()*900000).toString()
    const otpExpiresAt = new Date(Date.now()+10*60*1000)

    if(!password || password.length < 6){
      return NextResponse.json(
        {message: "Password must be atleast 6 characters"},
        {status: 400}
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    if(user && !user.isEmailVerified){
      user.name = name,
      user.email= email,
      user.password = hashedPassword,
      user.otp = otp,
      user.otpExpiresAt = otpExpiresAt
      await user.save()
    }else{
      user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt
    });
    }

    await sendMail(
      email,
      "Your OTP for Email Verification",
      `<h2>Your Email Verification OTP is <strong>${otp}</strong> </h2>`
    )

    return NextResponse.json(
      {
        message: "USER REGISTERED SUCCESSFULLY",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Register error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}