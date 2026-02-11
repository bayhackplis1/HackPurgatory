import { NextRequest, NextResponse } from "next/server";
import {
  findSession,
  getContent,
  saveContent,
  deleteContentById,
  addNotification,
  type ContentPost,
} from "@/lib/storage";

function requireAuth(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  if (!token) return null;
  return findSession(token);
}

export async function GET() {
  const content = getContent();
  // Sort: pinned first, then by date
  content.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return NextResponse.json({ content });
}

export async function POST(request: NextRequest) {
  const session = requireAuth(request);
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  try {
    const body = await request.json();
    const { title, description, category, tags, pinned, files } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Titulo y descripcion requeridos" },
        { status: 400 }
      );
    }

    const newPost: ContentPost = {
      id: crypto.randomUUID(),
      title,
      description,
      category: category || "General",
      author: session.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: files || [],
      pinned: pinned || false,
      tags: tags || [],
    };

    const content = getContent();
    content.unshift(newPost);
    saveContent(content);

    addNotification({
      type: "new_content",
      title: "Nuevo contenido publicado",
      message: `"${title}" ha sido publicado por ${session.username}`,
      contentId: newPost.id,
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = requireAuth(request);
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  try {
    const body = await request.json();
    const { id, title, description, category, tags, pinned, files } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID requerido" },
        { status: 400 }
      );
    }

    const content = getContent();
    const index = content.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Contenido no encontrado" },
        { status: 404 }
      );
    }

    content[index] = {
      ...content[index],
      title: title ?? content[index].title,
      description: description ?? content[index].description,
      category: category ?? content[index].category,
      tags: tags ?? content[index].tags,
      pinned: pinned ?? content[index].pinned,
      files: files ?? content[index].files,
      updatedAt: new Date().toISOString(),
    };

    saveContent(content);

    addNotification({
      type: "update_content",
      title: "Contenido actualizado",
      message: `"${content[index].title}" ha sido actualizado por ${session.username}`,
      contentId: id,
    });

    return NextResponse.json({ success: true, post: content[index] });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = requireAuth(request);
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID requerido" },
      { status: 400 }
    );
  }

  const content = getContent();
  const post = content.find((c) => c.id === id);

  const deleted = deleteContentById(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Contenido no encontrado" },
      { status: 404 }
    );
  }

  addNotification({
    type: "delete_content",
    title: "Contenido eliminado",
    message: `"${post?.title}" ha sido eliminado por ${session.username}`,
  });

  return NextResponse.json({ success: true });
}
