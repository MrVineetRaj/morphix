"use client";
import { VideoStatuses } from "@/lib/constants";
import { IVideo } from "@/lib/models/video.model";
import axios from "axios";
import { Download } from "lucide-react";
import React, { useEffect } from "react";

const VideoPage = ({ videoId }: { videoId: string }) => {
  const [video, setVideo] = React.useState<IVideo | null>(null);
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const fetchVideo = async (id: string) => {
      console.log("Fetching video with ID:", id);
      setLoading(true);
      try {
        const res = await axios.get(`/api/video/${id}`);
        console.log("Fetched video:", res.data);
        if (res.status !== 200) {
          return null;
        }

        console.log("Video data:", res.data);
        setVideo(res.data);
      } catch (error) {
        return null;
      } finally {
        setLoading(false);
      }
    };
    fetchVideo(videoId);
  }, [videoId]);
  return (
    <div>
      {video ? (
        <>
          {/* this page is dedicated to video  will display both transformedVideo and sourceVideo */}
          <h1 className="text-2xl text-primary">{video?.title}</h1>
          <p className="text-sm text-gray">{video?.description || ""}</p>

          <h2 className="text-xl text-white italic">
            Transformation Applied: {video?.transformationApplied}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="">
              <span className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Original Video</h1>
                {/* Download button to download videos provided for both of the videos */}
                <a href={video?.sourceVideoURL}>
                  <Download />
                </a>
              </span>
              <video
                className="w-full h-auto rounded-lg shadow-[2px_0_10px] shadow-primary/40 hover:shadow-primary/80  hover:shadow-[2px_0px_20px] transition-all duration-300"
                src={video?.sourceVideoURL}
                controls
                autoPlay
                loop
                muted
              ></video>
            </div>
            <div className="">
              <span className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Transformed Video</h1>
                {video?.status === VideoStatuses.COMPLETED && (
                  <a href={video?.transformedVideoURL}>
                    <Download />
                  </a>
                )}
              </span>
              {video?.status === VideoStatuses.COMPLETED ? (
                <video
                  className="w-full h-auto rounded-lg shadow-[2px_0_10px] shadow-primary/40 hover:shadow-primary/80  hover:shadow-[2px_0px_20px] transition-all duration-300"
                  src={video?.transformedVideoURL}
                  controls
                  autoPlay
                  loop
                  muted
                ></video>
              ) : (
                // if video is still under process then it will show this skeleton
                <div className="b p-8  h-full bg-secondary animate-pulse rounded-2xl items-center justify-center min"></div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-red-500/10 p-8 flex items-center justify-center min">
          {loading ? "Loading..." : "Error fetching video"}
        </div>
      )}
    </div>
  );
};

export default VideoPage;
