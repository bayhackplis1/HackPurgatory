import { NextRequest, NextResponse } from "next/server";
import { findSession, getSettings, saveSettings } from "@/lib/storage";

export async function GET() {
  const settings = getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const session = findSession(token);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const currentSettings = getSettings();
    const updated = { ...currentSettings, ...body };
    saveSettings(updated);
    return NextResponse.json({ success: true, settings: updated });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
