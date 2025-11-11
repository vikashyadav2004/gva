import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProtection extends Document {
  organizationId: mongoose.Schema.Types.ObjectId;
  createdByUserId: mongoose.Schema.Types.ObjectId;
  title: string;
}

const ProtectionSchema = new Schema<IProtection>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Protection: Model<IProtection> =
  mongoose.models.Protection ||
  mongoose.model<IProtection>("Protection", ProtectionSchema);

export default Protection;
