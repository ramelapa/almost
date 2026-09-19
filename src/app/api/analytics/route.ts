import { NextRequest, NextResponse } from "next/server";
import { AnalyticsPayloadSchema } from "@/packages/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = AnalyticsPayloadSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid analytics payload" }, { status: 400 });
    }

    const event = validated.data;

    // Structured logging of privacy-conscious product metric
    console.info(
      JSON.stringify({
        metric: "almost_analytics_event",
        eventName: event.eventName,
        sessionId: event.sessionId,
        type: event.experienceType,
        dopamineLevel: event.dopamineDialValue,
        duration: event.durationSeconds,
        timestamp: event.timestamp,
      })
    );

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Analytics error" }, { status: 500 });
  }
}
