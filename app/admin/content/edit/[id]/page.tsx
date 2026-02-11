"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import ContentForm from "@/components/admin/content-form";

interface ContentPost {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  pinned: boolean;
  files: {
    id: string;
    name: string;
    originalName: string;
    type: "image" | "audio" | "video" | "document" | "other";
    mimeType: string;
    size: number;
    path: string;
  }[];
}

export default function EditContentPage() {
  const params = useParams();
  const [post, setPost] = useState<ContentPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.content || []).find(
          (p: ContentPost) => p.id === params.id
        );
        setPost(found || null);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminShell>
    );
  }

  if (!post) {
    return (
      <AdminShell>
        <div className="text-center py-20 text-muted-foreground">
          Publicacion no encontrada
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Editar publicacion
          </h1>
          <p className="text-muted-foreground text-sm">
            Modifica el contenido de la publicacion
          </p>
        </div>
        <ContentForm mode="edit" initial={post} />
      </div>
    </AdminShell>
  );
}
