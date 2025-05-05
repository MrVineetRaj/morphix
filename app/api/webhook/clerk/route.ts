import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { UserJSON } from "@clerk/nextjs/server";
import UserCredit from "@/lib/models/credit.model";
import { connectToDatabase } from "@/lib/database";


// clerk webhook to make sure when a new user is created a new credit doc is created in my db
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    if (eventType === "user.created") {
      const userData = evt.data as UserJSON;

      await connectToDatabase();
      await UserCredit.create({
        clerkUserId: userData.id,
      });
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (err: any) {
    console.error("Error processing webhook:", err.message || err);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 } // Use 500 for internal server errors
    );
  }
}
