import { auth } from "@/auth";
import connectDB from "@/lib/db";
import userModel from "@/models/UserModel";
import vehicleModel from "@/models/VehicleModel";
import mongoose from "mongoose";

const VEHICLE_REGEX = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{1,2}\s?[0-9]{4}$/;

export async function POST(req: Request) {
    try {
        await connectDB();

        const session = await auth();
        if (!session || !session.user?.email)
            return new Response("Unauthorized", { status: 401 });

        console.log("post", session);

        const user = await userModel.findOne({ email: session.user.email });
        if (!user)
            return new Response("User not found", { status: 401 });

        const { type, number, modelName } = await req.json();
        if (!type || !number || !modelName)
            return new Response("Missing required fields", { status: 401 });

        // ✅ FIX: define vehicleNumber BEFORE using it
        const vehicleNumber = number.toUpperCase();

        // if (!VEHICLE_REGEX.test(vehicleNumber))
      

        const duplicate = await vehicleModel.findOne({ number: vehicleNumber });

        let vehicle = await vehicleModel.findOne({ owner: user._id });

        if (vehicle) {
            vehicle.type = type;
            vehicle.number = vehicleNumber;
            vehicle.modelName = modelName;
            vehicle.baseFare = 0;
            vehicle.pricePerKm = 0;
            vehicle.waitingCharge = 0;
            vehicle.status = "pending";

            await vehicle.save();

            if (user.partnerOnBoardingSteps > 1) {
                user.partnerOnBoardingSteps = 1;
                user.partnerStatus = "pending";
                await user.save();
            } else {
                user.partnerOnBoardingSteps = 3;
                user.partnerStatus = "pending";
                await user.save();
            }

            return Response.json(vehicle, { status: 201 });
        } else {
         if (duplicate) {
                return Response.json(
                    { message: "Vehicle Number already exists." },
                    { status: 400 }
                );
            }

            vehicle = await vehicleModel.create({
                type,
                number: vehicleNumber,
                modelName,
                owner: user._id,
            });

            if (user.partnerOnBoardingSteps < 1) {
                user.partnerOnBoardingSteps = 1;
            }

            user.role = "partner";
            user.partnerStatus = "pending";
            await user.save();

            return Response.json(vehicle, { status: 200 });
        }
    } catch (error) {
        console.log("vehicle", error);
        return Response.json("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        const session = await auth();
        if (!session || !session.user?.email)
            return new Response("Unauthorized", { status: 401 });

        console.log("get", session);

        const user = await userModel.findOne({ email: session.user.email });
        if (!user)
            return new Response("User not found", { status: 401 });

        const vehicle = await vehicleModel.findOne({ owner: user._id });

        return Response.json(vehicle , { status: 200 });

    } catch (error) {
        return Response.json(`Vehicle Error ${error}`, { status: 500 });
    }
}