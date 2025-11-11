import { Schema, model, models } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ORG_ADMIN = "ORG_ADMIN",
  USER = "USER",
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", default: null },
  },
  { timestamps: true }
);

// ✅ Prevents “Schema hasn't been registered” bug in Next.js
const User = models.User || model("User", UserSchema);
export default User;
