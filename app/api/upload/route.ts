import { NextRequest, NextResponse } from "next/server";
import { findSession, getUploadsDir, getFileType } from "@/lib/storage";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("session_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const session = findSession(token);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No se enviaron archivos" },
        { status: 400 }
      );
    }

    const uploadsDir = getUploadsDir();
    const uploadedFiles = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || "";
      const uniqueName = `${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      fs.writeFileSync(filePath, buffer);

      uploadedFiles.push({
        id: crypto.randomUUID(),
        name: uniqueName,
        originalName: file.name,
        type: getFileType(file.type),
        mimeType: file.type,
        size: file.size,
        path: `/uploads/${uniqueName}`,
      });
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch {
    return NextResponse.json(
      { error: "Error al subir archivos" },
      { status: 500 }
    );
  }
}
