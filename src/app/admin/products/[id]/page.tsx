"use client";

import { useParams } from "next/navigation";
import { AdminToolbar } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  return (
    <div>
      <AdminToolbar title="Edit Product" subtitle="Update catalogue item details." />
      <ProductForm productId={Number.isNaN(id) ? null : id} />
    </div>
  );
}
