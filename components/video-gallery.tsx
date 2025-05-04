"use client";

import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { IVideo } from "@/lib/models/video.model";
import { getAllVideos } from "@/lib/api_calls/video";
import { toast } from "sonner";
import Link from "next/link";

export default function VideoGallery({ query }: { query?: string }) {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadVideos = async (reset = false) => {
    console.log("Loading videos with query:", reset, query);
    try {
      setLoading(true);

      const newPage = reset ? 1 : page;

      const result = await getAllVideos(query, newPage);
      if (!result.videos.length) {
        setHasMore(false);
        return;
      }
      console.log("Videos fetched:", result.videos);
      if (reset) {
        setVideos(result.videos);
      } else {
        setVideos((prev) => [...prev, ...result.videos]);
      }
      setHasMore(result.hasMore);
      setPage(newPage);
      if (!reset) setPage((prev) => prev + 1);
    } catch (error) {
      toast.error("Error fetching videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos(true);
    if (query) {
      setVideos([]);
    }
  }, [query]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && videos.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : videos.length > 0 ? (
          videos.map((video) => (
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
            <h3 className="text-xl font-medium">No videos found</h3>
            <p className="text-muted-foreground mt-2">
              {query
                ? "Try a different search term"
                : "Upload your first video to get started"}
            </p>
          </div>
        )}
      </div>

      {hasMore && videos.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => loadVideos()}
            disabled={loading}
            className="border-blue-200 hover:bg-blue-50"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
