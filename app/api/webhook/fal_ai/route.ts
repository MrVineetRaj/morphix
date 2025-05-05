import { VideoStatuses } from "@/lib/constants";
import { connectToDatabase } from "@/lib/database";
import UserCredit from "@/lib/models/credit.model";
import Video from "@/lib/models/video.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received webhook:", body);

  try {
    const { requestId, payload } = body;
    let userId = "";
    
    await connectToDatabase();

    if (body && body.status === "OK") {
      const video = await Video.findOne({
        flaAiRequestId: requestId,
      });
      if (!video) {
        return NextResponse.json(
          { message: "Video not found" },
          {
            status: 404,
          }
        );
      }

      video.transformedVideoURL = payload?.video?.url;
      video.status = VideoStatuses.COMPLETED;
      await video.save();
      console.log("Video updated:", video);

      userId = video?.createBy;
    }

    if (body && body.status != "OK") {
      const video = await Video.findOne({
        flaAiRequestId: requestId,
      });
      if (!video) {
        return NextResponse.json(
          { message: "Video not found" },
          {
            status: 404,
          }
        );
      }

      video.error = payload?.detail[0]?.msg;
      video.status = VideoStatuses.FAILED;
      await video.save();
      console.log("Video updated:", video);
      userId = video.createBy;
      const userCredit = await UserCredit.findOne({
        clerkUserId: userId,
      });

      if (!userCredit) {
        return NextResponse.json(
          { message: "User not found" },
          {
            status: 404,
          }
        );
      }

      userCredit.credits = userCredit.credits + 1;

      await userCredit.save();

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
