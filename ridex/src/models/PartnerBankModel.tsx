import mongoose from "mongoose"

export interface IPartnerBank {
    owner: mongoose.Types.ObjectId
    accountHolder: string,
    accountNumber: string,
    ifsc: string,
    mobileNumber: string
    upi?: string,
    status: "not_added" | "added" | "verifed"
    createdAt: Date
    updatedAt: Date
}

const partnerBankSchema = new mongoose.Schema<IPartnerBank>({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "Partner",
        required: true
    },
    accountHolder:{
        type: String,
        required:true
    },
    accountNumber: {
        type: String,
        required:true,
        unique:true
    },
    ifsc: {
        type: String,
        required:true,
        uppercase:true
    },
    mobileNumber:{
        type: String,
        require:true
    },
    upi: {
        type: String
    },
    status: {
        type: String,
        enum: ["not_added", "added", "verifed"],
        default: "not_added"
    },

}, { timestamps: true })

const PartnerBankModel = mongoose.models.partnerBank ||  mongoose.model("partnerBank", partnerBankSchema)
export default PartnerBankModel