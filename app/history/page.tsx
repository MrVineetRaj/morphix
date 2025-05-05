"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { IVideo } from "@/lib/models/video.model";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect } from "react";

const HistoryPage = () => {
  const { user, isSignedIn } = useUser();
  const [videos, setVideos] = React.useState<IVideo[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  useEffect(() => {
    const fetchHistory = async () => {
      // fetching history of user video
      try {
        setLoading(true);
        if (!isSignedIn) return;
        const response = await fetch(`/api/video/user/${user.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        setVideos(data);
      } catch (error) {
        console.error("Error fetching video history:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchHistory();
  }, [user]);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && videos.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            //  rendering skelton of videos when loading them
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : videos.length > 0 ? (
          videos.map((video) => (
            // making it link so that if a user clicks on it he will be redirected to dedicated video page
            <Link
              href={`/video/${video?._id}`}
              key={video._id as string}
              className="space-y-3 border p-2 rounded-lg shadow-[2px_0_10px] shadow-primary/20 hover:shadow-primary/40 transition-all duration-200 ease-in-out"
            >
              <video
                src={video?.transformedVideoURL || video?.sourceVideoURL}
                className="h-[200px] w-full rounded-lg object-cover"
              ></video>
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-sm text-muted-foreground">
                {video.description}
              </p>
              <p className="text-sm text-muted-foreground">
                On {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium">No History found</h3>
            <p className="text-sm text-muted-foreground">
              You haven't transformed any videos yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
