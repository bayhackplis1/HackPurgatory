import { NextRequest, NextResponse } from "next/server";
import { findSession } from "@/lib/storage";
import { initializeDefaultAdmin } from "@/lib/init";

export async function GET(request: NextRequest) {
  await initializeDefaultAdmin();
  const token = request.cookies.get("session_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const session = findSession(token);
  if (!session) {
    return NextResponse.json({ error: "Sesion expirada" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      username: session.username,
      role: session.role,
    },
  });
}
