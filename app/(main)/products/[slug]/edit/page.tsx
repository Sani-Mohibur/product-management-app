"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetProductBySlugQuery } from "@/app/lib/services/productsService";
import ProductForm from "@/app/components/ProductForm"; // We will update this form next

export default function EditProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductBySlugQuery(slug, {
    skip: !slug,
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-dark-space">
        <p className="text-ghost-white">Loading form...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-dark-space">
        <p className="text-burnt-sienna">Could not load product data.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark-space p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-ghost-white">
          Edit Product
        </h1>
        <div className="rounded-lg bg-ghost-white/5 p-8">
          {/* We will update ProductForm to accept this initialData prop */}
          <ProductForm initialData={product} />
        </div>
      </div>
    </main>
  );
}
