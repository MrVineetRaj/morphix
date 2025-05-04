import axios from "axios";
import { toast } from "sonner";

export const createVideo = async (
  videoURL: string,
  transformationApplied: string,
  title: string,
  description: string = "",
  userId: string,
  author: {
    fullName: string;
    avatar: string;
  }
) => {
  try {
    const res = await axios.post("/api/video", {
      videoURL,
      transformationApplied,
      title,
      description,
      userId,
      author,
    });
    toast.success("Video created successfully");
    console.log("Video created successfully:", res.data);
    return true;
  } catch (error) {
    toast.error("Error creating video");
    console.error("Error creating video:", error);
  }
};

export const getVideoHistory = async (userId: string) => {
  try {
    const res = await axios.get(`/api/video/user/${userId}`);
    if (res.status !== 200) {
      toast.error("Error fetching video history");
      console.error("Error fetching video history:", res);
      return null;
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching video history:", error);
    toast.error("Error fetching video history");
    return null;
  }
};

export const getVideoById = async (videoId: string) => {
  try {
    const res = await axios.get(`/api/video/${videoId}`);
    if (res.status !== 200) {
      toast.error("Error fetching video");
      console.error("Error fetching video:", res);
      return null;
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching video:", error);
    toast.error("Error fetching video");
    return null;
  }
};

export const getAllVideos = async (query = "", page = 1) => {
  try {
    const res = await axios.get(`/api/video?query=${query}&page=${page}`);
    if (res.status !== 200) {
      toast.error("Error fetching all videos");
      console.error("Error fetching all videos:", res);
      return null;
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching all videos:", error);
    toast.error("Error fetching all videos");
    return null;
  }
};
