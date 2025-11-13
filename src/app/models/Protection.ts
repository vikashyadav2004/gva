import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProtection extends Document {
  title: string;                         // ⭐ ADD THIS
  organizationId: mongoose.Types.ObjectId;
  createdByUserId: mongoose.Types.ObjectId;
  rightholderId: mongoose.Types.ObjectId;

  protectionType: string;
  regReference: string;
  designation: string;
  oePartNo: string;
  imagePath?: string;
}

const ProtectionSchema = new Schema<IProtection>(
  {
    title: {
      type: String,
      required: true,
    },

    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    rightholderId: {
      type: Schema.Types.ObjectId,
      ref: "RightHolder",
      required: true,
    },

    protectionType: {
      type: String,
      required: true,
    },

    regReference: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    oePartNo: {
      type: String,
      required: true,
    },

    imagePath: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Protection: Model<IProtection> =
  mongoose.models.Protection ||
  mongoose.model<IProtection>("Protection", ProtectionSchema);

export default Protection;
