import { Schema, Document, models, model } from "mongoose";

// Define the interface for the User document
export interface IUserCredit extends Document {
  clerkUserId: string; // Optional field
  credits: number; // Optional field
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema
const UserCreditSchema: Schema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: [true, "Clerk User ID is required."],
      unique: true,
      trim: true,
    },
    credits: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
// Check if the model already exists to prevent recompilation issues during hot-reloading
const UserCredit =
  models.UserCredit || model<IUserCredit>("UserCredit", UserCreditSchema);

export default UserCredit;
