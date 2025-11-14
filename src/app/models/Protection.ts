import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProtection extends Document {
  rightHolderId: mongoose.Schema.Types.ObjectId;
  organizationId: mongoose.Schema.Types.ObjectId | null;
  createdByUserId: mongoose.Schema.Types.ObjectId;
  assignedUserId: mongoose.Schema.Types.ObjectId | null;
  type: string;
  title: string;
  imageUrl: string;  // ⭐ NEW
}

const ProtectionSchema = new Schema<IProtection>(
  {
    rightHolderId: {
      type: Schema.Types.ObjectId,
      ref: "RightHolder",
      required: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: false,
      default: null,
    },

    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },

    type: { type: String, required: true },
    title: { type: String, required: true },

    imageUrl: { type: String, required: true }, // ⭐ FILE LOCATION STORED HERE
  },
  { timestamps: true }
);

const Protection: Model<IProtection> =
  mongoose.models.Protection ||
  mongoose.model<IProtection>("Protection", ProtectionSchema);

export default Protection;
