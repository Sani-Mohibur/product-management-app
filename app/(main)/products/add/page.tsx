import ProductForm from "@/app/components/ProductForm";
export default function AddProductPage() {
  return (
    <main className="min-h-screen bg-dark-space p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-ghost-white">
          Create New Product
        </h1>

        <div className="rounded-lg bg-ghost-white/5 p-8">
          <ProductForm />
        </div>
      </div>
    </main>
  );
}
