"use client";

import { Trash2 } from "lucide-react";
import { deleteProductAction } from "@/lib/actions/products";

export default function DeleteProductButton({ id }: { id: string }) {
  return (
    <form 
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-red-500 hover:text-red-700 transition-colors p-2" title="Delete Product">
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
