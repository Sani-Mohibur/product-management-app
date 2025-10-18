"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetProductBySlugQuery,
  useDeleteProductMutation,
} from "@/app/lib/services/productsService";
import Link from "next/link";
import ConfirmationModal from "@/app/components/ConfirmationModal";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const {
    data: product,
    error,
    isLoading,
  } = useGetProductBySlugQuery(slug!, {
    skip: !slug,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!product) return; // This check is fine
    try {
      await deleteProduct(product.id).unwrap();
      setIsModalOpen(false);
      router.push("/products");
    } catch (err) {
      console.error("Failed to delete product:", err);
      setIsModalOpen(false);
    }
  };

  const handleEdit = () => {
    router.replace(`/products/${slug}/edit`);
  };

  // --- THIS IS THE FIX ---
  // These checks run BEFORE the main return, proving 'product' exists.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-space">
        <p className="text-ghost-white">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-space">
        <p className="text-burnt-sienna">Failed to load product details.</p>
      </div>
    );
  }
  // --- END OF FIX ---

  // By this point, TypeScript knows 'product' is defined.
  return (
    <>
      <main className="min-h-screen bg-dark-space p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Link href="/products" className="text-tan-hide hover:underline">
              &larr; Back to Products
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              {/* All errors will be gone from here down */}
              <img
                src={
                  (product.images && product.images[0]) ||
                  "https://via.placeholder.com/600"
                }
                alt={product.name}
                className="w-full rounded-lg object-cover shadow-lg"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="mb-2 text-4xl font-bold text-ghost-white">
                {product.name}
              </h1>
              <p className="mb-4 text-lg text-ghost-white/70">
                {product.category.name}
              </p>
              <p className="mb-6 flex-grow text-ghost-white/90">
                {product.description}
              </p>
              <div className="mt-auto">
                <p className="mb-6 text-5xl font-light text-tan-hide">
                  ${product.price}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleEdit}
                    className="flex-1 rounded-md bg-forest-green px-6 py-3 text-center font-semibold text-ghost-white transition hover:bg-forest-green/90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isDeleting}
                    className="rounded-md bg-burnt-sienna px-6 py-3 font-semibold text-ghost-white transition hover:bg-burnt-sienna/90 disabled:cursor-not-allowed disabled:bg-burnt-sienna/50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </>
  );
}
