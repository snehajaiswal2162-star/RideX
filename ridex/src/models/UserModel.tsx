import mongoose, { Mongoose, Document } from 'mongoose'

type VideoKycStatus = "not_required" | "pending" | "in_progress" | "approved" | "rejected"

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: 'user' | 'partner' | 'admin',
    isEmailVerified?: boolean,
    partnerOnBoardingSteps: number,
    mobileNumber?: string,
    otp?: string,
    otpExpiresAt?: Date,
    partnerStatus: 'pending' | 'approved' | 'rejected',
    rejectionReason?: string,
    videoKycStatus: VideoKycStatus,
    videoKycRoomId: string,
    videoKycRejectionReason: string,
    socketId: string | null,
    location?: {
        type: "Point",
        coordinates: [number, number]
    }
    isOnline: boolean
    updatedAt: Date,
    createdAt: Date
}
const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "user",
        enum: ['user', 'partner', 'admin']
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    partnerOnBoardingSteps: {
        type: Number,
        min: 0,
        max: 8,
        default: 0
    },
    otp: {
        type: String
    },
    partnerStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String
    },
    videoKycStatus: {
        type: String,
        enum: ["not_required", "pending", "in_progress", "approved", "rejected"],
        default: "not_required"
    },
    videoKycRoomId: {
        type: String,
    },
    videoKycRejectionReason: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    },
    mobileNumber: {
        type: String
    },
    socketId: {
        type: String,
        default: null
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number]
    },
    isOnline: {
        type: Boolean,
        default: false,
        index:true
    }
}, { timestamps: true })

userSchema.index({location:"2dsphere"})

const userModel = mongoose.models.User || mongoose.model("User", userSchema)
export default userModel