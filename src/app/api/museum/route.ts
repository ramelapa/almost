import { NextRequest, NextResponse } from "next/server";
import { MuseumItem, MuseumItemSchema } from "@/packages/schemas";

// In-memory persistent cache for server-side state
let memoryMuseumItems: MuseumItem[] = [];

export async function GET() {
  return NextResponse.json({
    items: memoryMuseumItems,
    count: memoryMuseumItems.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = MuseumItemSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid item", details: validated.error }, { status: 400 });
    }

    const item = validated.data;
    memoryMuseumItems = [item, ...memoryMuseumItems.filter((i) => i.id !== item.id)];

    return NextResponse.json({ success: true, item });
  } catch {
    return NextResponse.json({ error: "Failed to save museum item" }, { status: 500 });
  }
}
