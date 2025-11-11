import { Schema, model, models } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    adminUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default models.Organization || model("Organization", OrganizationSchema);
