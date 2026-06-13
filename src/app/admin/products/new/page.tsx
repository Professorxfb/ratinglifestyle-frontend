"use client";

import { AdminToolbar } from "@/components/admin/ui";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <AdminToolbar title="Add Product" subtitle="Create a new catalogue item." />
      <ProductForm productId={null} />
    </div>
  );
}
