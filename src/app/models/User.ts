import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["SUPER_ADMIN", "ORG_ADMIN", "USER"], default: "USER" },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", default: null },
  },
  { timestamps: true }
);

// ✅ prevents “Schema hasn't been registered” bug in Next.js
export default models.User || model("User", UserSchema);
