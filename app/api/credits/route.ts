import { connectToDatabase } from "@/lib/database";
import UserCredit from "@/lib/models/credit.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    await connectToDatabase();
    const credits = await UserCredit.findOne({ clerkUserId: userId });

    if (!credits) {
      return NextResponse.json(
        { message: "No credits found" },
        { status: 404 }
      );
    }

    return NextResponse.json(credits, { status: 200 });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { message: "Error fetching credits" },
      { status: 500 }
    );
  }
}
