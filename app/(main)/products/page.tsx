"use client";

import { useState } from "react";
// 1. Import useRouter and useSearchParams
import { useRouter, useSearchParams } from "next/navigation";

import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useDeleteProductMutation,
} from "@/app/lib/services/productsService";
import { useGetCategoriesQuery } from "@/app/lib/services/categoriesService";
import { useDebounce } from "@/app/hooks/useDebounce";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import TrashIcon from "@/app/components/TrashIcon";
import Link from "next/link";

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  // 2. Setup router and search params
  const router = useRouter();
  const searchParams = useSearchParams();

  // 3. Read page and category state FROM the URL
  const page = parseInt(searchParams.get("page") || "1");
  const categoryId = searchParams.get("category") || "";

  // Calculate offset from the URL page number
  const offset = (page - 1) * PRODUCTS_PER_PAGE;

  // Local state is still needed for debounced search and the delete modal
  const [searchTerm, setSearchTerm] = useState("");
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: categories } = useGetCategoriesQuery();

  // 4. Pass URL-derived state (offset, categoryId) to the query
  const {
    data: paginatedProducts,
    error: paginatedError,
    isLoading: paginatedLoading,
  } = useGetProductsQuery(
    { offset, limit: PRODUCTS_PER_PAGE, categoryId: categoryId || undefined },
    { skip: !!debouncedSearchTerm }
  );

  const {
    data: searchedProducts,
    error: searchError,
    isLoading: searchLoading,
  } = useSearchProductsQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = debouncedSearchTerm ? searchedProducts : paginatedProducts;
  const isLoading = paginatedLoading || searchLoading;
  const error = paginatedError || searchError;

  // 5. Rewrite handlers to update the URL
  const handleNext = () => {
    const newPage = page + 1;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    router.push(`/products?${current.toString()}`);
  };

  const handlePrevious = () => {
    const newPage = page - 1;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    router.push(`/products?${current.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Set new category and reset page to 1
    current.set("page", "1");
    if (newCategory) {
      current.set("category", newCategory);
    } else {
      current.delete("category"); // Remove if "All Categories" is selected
    }
    router.push(`/products?${current.toString()}`);
  };

  // Delete handlers remain the same
  const openDeleteModal = (id: string) => setProductToDelete(id);
  const closeDeleteModal = () => setProductToDelete(null);
  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete).unwrap();
      } catch (err) {
        console.error("Failed to delete the product:", err);
      } finally {
        closeDeleteModal();
      }
    }
  };

  return (
    <>
      <main className="min-h-screen bg-dark-space p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-ghost-white">Products</h1>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              {/* 6. Set select value from URL state */}
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-2 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide sm:w-48"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-2 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide sm:w-64"
              />
              <Link
                href="/products/add"
                className="flex-shrink-0 rounded-md bg-forest-green px-4 py-2 text-center font-semibold text-ghost-white transition hover:bg-forest-green/90"
              >
                Add Product
              </Link>
            </div>
          </div>

          {isLoading && (
            <p className="text-center text-ghost-white">Loading products...</p>
          )}
          {error && (
            <p className="text-center text-burnt-sienna">
              Failed to load products.
            </p>
          )}

          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <Link href={`/products/${product.slug}`} key={product.id}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-lg bg-ghost-white/5 shadow-md">
                      <img
                        src={
                          (product.images && product.images[0]) ||
                          "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="p-4">
                        <h3 className="truncate text-lg font-semibold text-ghost-white">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-xl font-bold text-tan-hide">
                          ${product.price}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openDeleteModal(product.id);
                        }}
                        className="absolute top-2 right-2 rounded-full bg-dark-space/50 p-2 text-burnt-sienna opacity-0 backdrop-blur-sm transition hover:bg-dark-space/75 group-hover:opacity-100"
                        aria-label="Delete product"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {!debouncedSearchTerm && (
                <div className="mt-8 flex justify-center gap-4">
                  {/* 7. Disable button based on URL page state */}
                  <button
                    onClick={handlePrevious}
                    disabled={page === 1}
                    className="rounded-md bg-tan-hide px-4 py-2 font-semibold text-dark-space disabled:cursor-not-allowed disabled:bg-tan-hide/50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={
                      !paginatedProducts ||
                      paginatedProducts.length < PRODUCTS_PER_PAGE
                    }
                    className="rounded-md bg-tan-hide px-4 py-2 font-semibold text-dark-space disabled:cursor-not-allowed disabled:bg-tan-hide/50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            !isLoading && (
              <p className="text-center text-ghost-white/50">
                No products found.
              </p>
            )
          )}
        </div>
      </main>

      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </>
  );
}
