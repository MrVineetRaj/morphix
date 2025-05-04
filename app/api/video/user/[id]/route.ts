import { getVideoHistory } from "@/lib/actions/video-actions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    console.log("Received ID:", id);

    const result = await getVideoHistory(id as string);

    if (!result) {
      return NextResponse.json(
        { message: "Video not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(result, { status: 200 });
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
