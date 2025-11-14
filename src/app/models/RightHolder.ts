import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRightHolder extends Document {
  name: string;
  organizationId: mongoose.Schema.Types.ObjectId;
  createdByUserId: mongoose.Schema.Types.ObjectId;
  approved:boolean
}

const RightHolderSchema = new Schema<IRightHolder>(
  {
    name: { type: String, required: true },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: false,     // 🔥 NOT required
      default: null,
    },

    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const RightHolder: Model<IRightHolder> =
  mongoose.models.RightHolder ||
  mongoose.model<IRightHolder>("RightHolder", RightHolderSchema);

export default RightHolder;
