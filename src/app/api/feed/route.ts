import { NextRequest, NextResponse } from "next/server";
import { initialFeedItems } from "@/lib/storage";

let currentFeed = [...initialFeedItems];

export async function GET() {
  return NextResponse.json({
    items: currentFeed,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle "Me too" increment
    if (body.action === "me-too" && body.id) {
      currentFeed = currentFeed.map((item) =>
        item.id === body.id
          ? { ...item, meTooCount: item.meTooCount + 1 }
          : item
      );
      const updatedItem = currentFeed.find((i) => i.id === body.id);
      return NextResponse.json({ success: true, item: updatedItem });
    }

    // Handle publishing new anonymous activity
    if (body.message && body.experienceType) {
      const newItem = {
        id: `feed_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        location: body.location || "Someone somewhere",
        message: body.message,
        experienceType: body.experienceType,
        avoidedAmount: body.avoidedAmount || 0,
        meTooCount: 1,
        timestamp: "Just now",
        isDemo: false,
      };
      currentFeed = [newItem, ...currentFeed];
      return NextResponse.json({ success: true, item: newItem });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Feed action failed" }, { status: 500 });
  }
}
