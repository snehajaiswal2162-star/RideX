import mongoose from "mongoose";

export type BookingStatus =
  | "idle"
  | "requested"
  | "awaiting_payment"
  | "confirmed"
  | "started"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "cash"
  | "failed";

export interface IBooking {
  _id?: mongoose.Types.ObjectId; 
  user: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  vehicle: mongoose.Types.ObjectId;

  pickupAddress: string;
  dropAddress: string;

  pickupLocation: {
    type: "Point";
    coordinates: [number, number];
  };

  dropLocation: {
    type: "Point";
    coordinates: [number, number];
  };

  fare: number;

  userMobileNumber: number;
  driverMobileNumber?: number;

  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentDeadline: Date;

  adminCommission: number;
  partnerAmount: number;

  pickupOtp?: string;
  pickupOtpExpires?: Date;

  dropOtp?: string;
  dropOtpExpires?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle",
      required: true,
    },

    pickupAddress: {
      type: String,
      required: true,
    },

    dropAddress: {
      type: String,
      required: true,
    },

    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    dropLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    fare: {
      type: Number,
      required: true,
    },

    userMobileNumber: {
      type: Number,
      required: true,
    },

    driverMobileNumber: {
      type: Number,
    },

    bookingStatus: {
      type: String,
      enum: [
        "idle",
        "requested",
        "awaiting_payment",
        "confirmed",
        "started",
        "completed",
        "cancelled",
        "rejected",
        "expired",
      ],
      default: "idle",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cash", "failed"],
      default: "pending",
    },

    paymentDeadline:{
      type:Date,
    },

    adminCommission: {
      type: Number,
      default: 0,
    },

    partnerAmount: {
      type: Number,
      default: 0,
    },

    pickupOtp: String,

    pickupOtpExpires: Date,

    dropOtp: String,

    dropOtpExpires: Date,
  },
  {
    timestamps: true,
  }
);

// GeoSpatial indexes
bookingSchema.index({ pickupLocation: "2dsphere" });
bookingSchema.index({ dropLocation: "2dsphere" });

const bookingModel =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", bookingSchema);

export default bookingModel;