"use client";

import { useSearchParams } from "next/navigation";
import VideoGallery from "@/components/video-gallery";
import SearchBar from "@/components/search-bar";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams(); // Get the search params object
  const [query, setQuery] = useState("");

  useEffect(() => {
    const queryParam = searchParams.get("query");
    console.log("Query param:", queryParam);
    setQuery(queryParam || "");
  }, [searchParams]); // Update the query state when search params change

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar initialQuery={query} />
      <VideoGallery query={query} />
    </div>
  );
}
