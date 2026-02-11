"use client";

import AdminShell from "@/components/admin/admin-shell";
import ContentForm from "@/components/admin/content-form";

export default function NewContentPage() {
  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            Nueva publicacion
          </h1>
          <p className="text-muted-foreground text-sm">
            Crea nuevo contenido para la comunidad
          </p>
        </div>
        <ContentForm mode="create" />
      </div>
    </AdminShell>
  );
}
