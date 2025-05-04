import { VideoStatuses } from "@/lib/constants";
import Video from "@/lib/models/video.model";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received webhook:", body);

    if (body.event === "video_generation_completed") {
      const { userId, videoId } = body.data;
      console.log(
        `Video generation completed for user ${userId}, video ${videoId}`
      );

      await Video.findOneAndUpdate(
        {
          flaAiRequestId: videoId,
        },
        {
          status: VideoStatuses.COMPLETED,
        },
        {
          new: true,
        }
      );
    }

    return new Response(JSON.stringify({ message: "Webhook received" }), {
      status: 200,
    });
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
