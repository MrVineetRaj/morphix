import { VideoStatuses } from "@/lib/constants";
import UserCredit from "@/lib/models/credit.model";
import Video from "@/lib/models/video.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received webhook:", body);

  try {
    const { requestId, payload } = body;
    let userId = "";
    if (body && body.status === "OK") {
      const updatedVideo = await Video.findOneAndUpdate(
        { flaAiRequestId: requestId },
        {
          transformedVideoURL: payload.videos[0].url,
          status: VideoStatuses.COMPLETED,
        },
        {
          new: true,
        }
      );

      userId = updatedVideo?.createBy;
      await UserCredit.findOneAndUpdate(
        { clerkUserId: userId },
        {
          $inc: { credits: -1 },
        }
      );
    }

    if (body && body.status != "OK") {
      await Video.findOneAndUpdate(
        { flaAiRequestId: requestId },
        {
          error: payload.detail[0].msg,
          status: VideoStatuses.FAILED,
        },
        {
          new: true,
        }
      );

      return NextResponse.json(
        { message: body.payload.detail[0].msg },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      { message: "Webhook received" },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    console.error("Error processing webhook:", err.message || err);
    return new Response(
      JSON.stringify({ message: "Error processing webhook" }),
      {
        status: 500,
      }
    );
  }
}
