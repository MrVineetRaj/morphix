import { VideoStatuses } from "@/lib/constants";
import { connectToDatabase } from "@/lib/database";
import UserCredit from "@/lib/models/credit.model";
import Video from "@/lib/models/video.model";
import { NextResponse } from "next/server";

// to handle fal.ai webhook on completing on transformation
export async function POST(req: Request) {
  const body = await req.json();
  

  try {
    const { request_id, payload } = body;
    let userId = "";

    await connectToDatabase();

    if (body && body.status === "OK") {
      // find related video
      const video = await Video.findOne({
        flaAiRequestId: request_id,
      });
      if (!video) {
        return NextResponse.json(
          { message: "Video not found" },
          {
            status: 404,
          }
        );
      }

      // store it's metadata
      video.transformedVideoURL = payload?.video?.url;
      video.status = VideoStatuses.COMPLETED;
      await video.save();
      

      userId = video?.createBy;
    }

    if (body && body.status != "OK") {
      // if request failed store the error
      const video = await Video.findOne({
        flaAiRequestId: request_id,
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

      // append the user credits
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
