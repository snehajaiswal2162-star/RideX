import connectDB from "@/lib/db";
import userModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDB()
        const {email,otp} = await req.json()
        if(!email || !otp){
            return NextResponse.json(
                {message:"Email and OTP are required"},
                {status:400}
            )
        }

        let user = await userModel.findOne({email})
        if(!user){
            return NextResponse.json(
                {message:"User is required"},
                {status:401}
            )
        }

        if(user.isEmailVerified){
            return NextResponse.json(
                {message:"Email is already verifed"},
                {status:400}
            )
        }

        if(!user.otpExpiresAt || user.otpExpiresAt < new Date()){
            return NextResponse.json(
                {message:"OTP is expired"},
                {status:400}
            )
        }
        
        if(!user.otp || user.otp !== otp){
            return NextResponse.json(
                {message:"Invaild OTP"},
                {status:400}
            )
        }

        user.isEmailVerified=true
        user.otpExpiresAt=null
        user.otp=null
        
        await user.save()
        return NextResponse.json(
            {message:"Email verify successfully"},
            {status:200}
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {message:"Email verify error",error},
            {status:500}
        )
    }
}