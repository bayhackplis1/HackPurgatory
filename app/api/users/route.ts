import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  findSession,
  getUsers,
  saveUsers,
  findUserByUsername,
  type AdminUser,
} from "@/lib/storage";

function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  if (!token) return null;
  const session = findSession(token);
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function GET(request: NextRequest) {
  const session = requireAdmin(request);
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const users = getUsers().map((u) => ({
    id: u.id,
    username: u.username,
    role: u.role,
    createdAt: u.createdAt,
  }));

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = requireAdmin(request);
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  try {
    const { username, password, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contrasena requeridos" },
        { status: 400 }
      );
    }

    if (findUserByUsername(username)) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 12);
    const newUser: AdminUser = {
      id: crypto.randomUUID(),
      username,
      passwordHash: hash,
      role: role || "editor",
      createdAt: new Date().toISOString(),
    };

    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, username: newUser.username, role: newUser.role },
    });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = requireAdmin(request);
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json(
      { error: "ID de usuario requerido" },
      { status: 400 }
    );
  }

  if (userId === session.userId) {
    return NextResponse.json(
      { error: "No puedes eliminarte a ti mismo" },
      { status: 400 }
    );
  }

  const users = getUsers().filter((u) => u.id !== userId);
  saveUsers(users);

  return NextResponse.json({ success: true });
}
