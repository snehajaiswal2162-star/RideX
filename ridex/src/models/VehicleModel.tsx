import mongoose from "mongoose";

export type vehicleType = "car" | "bike" | "truck" | "loading" | "auto"

export interface IVehicle {
    _id?: mongoose.Types.ObjectId
    owner: mongoose.Types.ObjectId
    type: vehicleType
    modelName: string
    number: string
    imageUrl?: string
    baseFare?: number
    pricePerKm?: number
    waitingCharge?: number
    status: "approved" | "pending" | "rejected"
    rejectionReason?: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const vehicleSchema = new mongoose.Schema<IVehicle>({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["car", "bike", "truck", "loading", "auto"],
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: String,
    baseFare: Number,
    pricePerKm: Number,
    waitingCharge: Number,
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending"
    },
    rejectionReason: String,
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

const vehicleModel = mongoose.models.vehicle || mongoose.model("vehicle", vehicleSchema)
export default vehicleModel