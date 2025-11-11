import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrganization extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  adminUserId?: mongoose.Types.ObjectId | null; // ✅ changed this
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    adminUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const Organization: Model<IOrganization> =
  mongoose.models.Organization ||
  mongoose.model<IOrganization>("Organization", OrganizationSchema);

export default Organization;
