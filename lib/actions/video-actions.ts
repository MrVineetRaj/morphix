import axios from "axios";

import Video from "../models/video.model";
import crypto from "crypto";
import { fal } from "@fal-ai/client";
import { VideoStatuses, VideoType } from "../constants";
import { connectToDatabase } from "../database";
import UserCredit from "../models/credit.model";

export const deleteUploadCareFile = async (uuid: string) => {
  try {
    await fetch(`https://api.uploadcare.com/files/${uuid}/storage/`, {
      method: "DELETE",
      headers: {
        Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
        Accept: "application/vnd.uploadcare-v0.5+json",
      },
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
};

export const startTransformingVideo = async (
  videoURL: string,
  transformationApplied: string,
  title: string,
  description: string,
  userId: string,
  author: {
    fullName: string;
    avatar: string;
  }
) => {
  try {
    // upload your file to cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const timestamp = Math.floor(Date.now() / 1000);

    const signatureString = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    const formData = new URLSearchParams();
    formData.append("file", videoURL);

    formData.append("api_key", apiKey as string);
    formData.append("timestamp", `${timestamp}`);
    formData.append("signature", signature);

    const cloudinaryRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData
    );

    if (cloudinaryRes.status !== 200) {
      console.error("Error uploading video to Cloudinary:", cloudinaryRes);
      throw new Error("Failed to upload video to Cloudinary");
    }
    // get the url from cloudinary
    const cloudinaryURL = cloudinaryRes.data.secure_url;

    await connectToDatabase();

    const userCredits = await UserCredit.findOne({
      clerkUserId: userId,
    });

    if (!userCredits) {
      return {
        message: "User not found",
        success: false,
      };
    }

    if (userCredits.credits < 1) {
      return {
        message: "Not enough credits",
        success: false,
      };
    }

    const { request_id } = await fal.queue.submit(
      "fal-ai/hunyuan-video/video-to-video",
      {
        input: {
          prompt: transformationApplied,
          video_url: cloudinaryURL,
        },

        webhookUrl: "https://morphix.unknownbug.tech/api/webhook/fal_ai",
      }
    );

    const video = await Video.create({
      createBy: userId,
      author,
      sourceVideoURL: cloudinaryURL,
      transformedVideoURL: "",
      transformationApplied,
      title,
      flaAiRequestId: request_id,
      description,
    });

    return {
      message: "Video transformation started",
      videoId: video._id,
      success: true,
    };
  } catch (error) {
    console.error("Error transforming video:", error);
    throw error;
  }
};

export const getVideoById = async (videoId: string) => {
  try {
    await connectToDatabase();
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    return video;
  } catch (error) {
    console.error("Error fetching video:", error);
    throw error;
  }
};

export const getAllVideos = async (query: string = "", page = 1) => {
  try {
    const limit = 20;
    await connectToDatabase();
    console.log("Querying videos with query:", query);
    const videos = await Video.find({
      videoType: VideoType.PUBLIC,
      status: VideoStatuses.COMPLETED,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    console.log("Videos found:", videos);

    const videosCnt = await Video.countDocuments({
      videoType: VideoType.PUBLIC,
      status: VideoStatuses.COMPLETED,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    const hasMore = videosCnt > page * limit;

    if (!videos) {
      return {
        videos: [],
        hasMore: false,
      };
    }

    return { videos, hasMore };
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

export const getVideoHistory = async (userId: string) => {
  try {
    await connectToDatabase();
    const videos = await Video.find({ createBy: userId }).sort({
      createdAt: -1,
    });

    if (!videos) {
      throw new Error("No videos found");
    }

    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};
