import { getVideoById } from "@/lib/actions/video-actions";
import { NextRequest, NextResponse } from "next/server";

// api to get just one video according to videoId
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const videoId = url.pathname.split("/").pop();

    const result = await getVideoById(videoId as string);

    if (!result) {
      return NextResponse.json(
        { message: "Video not found" },
        {
          status: 404,
        }
      );
    }
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
