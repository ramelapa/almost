import { NextRequest, NextResponse } from "next/server";
import { aiDirector } from "@/packages/ai-director";
import { ExperienceRouterInputSchema } from "@/packages/schemas";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    const body = await req.json();
    const validated = ExperienceRouterInputSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { prompt, intensity } = validated.data;

    // Direct and construct the experience
    const experience = await aiDirector.direct(prompt, intensity);
    const latency = Date.now() - startTime;

    // Structured observability log (no sensitive data)
    console.info(
      JSON.stringify({
        requestId,
        type: experience.type,
        intensity,
        durationMs: latency,
        timestamp: new Date().toISOString(),
      })
    );

    return NextResponse.json(experience, {
      status: 200,
      headers: {
        "x-request-id": requestId,
        "x-latency-ms": latency.toString(),
      },
    });
  } catch (err) {
    console.error(`[API /api/experience] Unhandled error in requestId: ${requestId}`, err);
    return NextResponse.json(
      { error: "Failed to generate experience" },
      { status: 500 }
    );
  }
}
