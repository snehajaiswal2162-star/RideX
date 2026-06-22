import mongoose from "mongoose"

export interface IPartnerDocs {
    owner: mongoose.Types.ObjectId
    aadharUrl: string
    rcUrl: string
    licenseUrl: string
    status: "approved" | "pending" | "rejected"
    rejectionReason?: string
    createdAt: Date
    updatedAt: Date
}

const partnerDocsSchema = new mongoose.Schema<IPartnerDocs>({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "Partner",
        required: true
    },
     aadharUrl: String,
    rcUrl: String,
    licenseUrl: String,
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending"
    },
    rejectionReason: String,

}, { timestamps: true })

const PartnerDocsModel =  mongoose.models.partnerDocs || mongoose.model("partnerDocs", partnerDocsSchema)
export default PartnerDocsModel