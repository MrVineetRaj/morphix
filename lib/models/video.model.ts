import { Schema, Document, models, model } from "mongoose";
import { availableVideoStatuses, availableVideoTypes } from "../constants";

// Define the interface for the User document
export interface IVideo extends Document {
  createBy: string;
  author: {
    fullName: string;
    avatar: string;
  };
  sourceVideoURL: string;
  transformedVideoURL?: string;
  transformationApplied: string;
  flaAiRequestId?: string;
  title: string;
  description?: string;
  error?: string;
  status: "draft" | "processing" | "completed" | "failed";
  createdAt: Date;
}

// Define the Mongoose schema
const VideoSchema: Schema = new Schema(
  {
    createBy: String,
    author: {
      fullName: String,
      avatar: String,
    },
    sourceVideoURL: {
      type: String,
      trim: true,
      required: true,
    },
    transformedVideoURL: {
      type: String,
      trim: true,
    },
    transformationApplied: {
      type: String,
      trim: true,
      required: true,
    },
    flaAiRequestId: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    error:{
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: availableVideoStatuses,
      default: "draft",
    },
    videoType: {
      type: String,
      enum: availableVideoTypes,
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

const Video = models.Video || model<IVideo>("Video", VideoSchema);

export default Video;
