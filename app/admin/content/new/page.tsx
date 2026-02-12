"use client";

import AdminShell from "@/components/admin/admin-shell";
import ContentForm from "@/components/admin/content-form";

export default function NewContentPage() {
  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-white">
            Nueva publicacion
          </h1>
          <p className="text-white/40 text-sm">
            Crea nuevo contenido para la comunidad
          </p>
        </div>
        <ContentForm mode="create" />
      </div>
    </AdminShell>
  );
}
