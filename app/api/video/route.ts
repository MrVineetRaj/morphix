import {
  getAllVideos,
  startTransformingVideo,
} from "@/lib/actions/video-actions";
import { NextResponse } from "next/server";


//  api request to start new video transformation 
export async function POST(req: Request) {
  try {
    const {
      videoURL,
      transformationApplied,
      title,
      description,
      userId,
      author,
    } = await req.json();

    console.log("Received data:", {
      videoURL,
      transformationApplied,
      title,
      description,
      userId,
      author,
    });
    const result = await startTransformingVideo(
      videoURL,
      transformationApplied,
      title,
      description || "",
      userId,
      author
    );

    console.log("Transformation result:", result);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Error processing webhook:", err.message || err);
    return NextResponse.json(
      { message: "Error processing webhook" },
      {
        status: 500,
      }
    );
  }
}

//  api request to get all videos based on search query and page number
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");
    const page = url.searchParams.get("page");

    console.log("Received query:", query);
    const result = await getAllVideos(query || "", page ? parseInt(page) : 1);

    return NextResponse.json(
      {
        message: "Videos fetched successfully",
        videos: result.videos,
        hasMore: result.hasMore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing GET request:", error);
    return NextResponse.json(
      { message: "Error processing GET request" },
      {
        status: 500,
      }
    );
  }
}
