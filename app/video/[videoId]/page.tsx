"use client";
import VideoPage from "@/components/video-page";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

const MainVideoPage = () => {
  const params = useParams();
  const [videoId, setVideoId] = useState<string>("");

  useEffect(() => {
    const videoId = params.videoId;
    
    if (!videoId) {
      return;
    }
    
    setVideoId((videoId as string) || "");
  }, [params]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <VideoPage videoId={videoId || ""} />
    </div>
  );
};

export default MainVideoPage;
