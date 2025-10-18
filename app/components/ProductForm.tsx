"use client";

import { useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  Product,
} from "@/app/lib/services/productsService";
import { useGetCategoriesQuery } from "@/app/lib/services/categoriesService";
import { useRouter } from "next/navigation";

// 1. Schema with z.coerce.number()
const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }), // THIS IS THE FIX
  categoryId: z.string().min(1, { message: "Please select a category" }),
  images: z
    .array(
      z.object({
        url: z.string().url({ message: "Please enter a valid URL" }),
      })
    )
    .min(1, { message: "Please add at least one image URL" }),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isLoading = isCreating || isUpdating || isLoadingCategories;

  const [imageInput, setImageInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    // 2. Complete defaultValues for both modes
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          categoryId: initialData.category.id,
          images:
            (initialData.images &&
              initialData.images.map((url) => ({ url: url }))) ||
            [],
        }
      : {
          name: "",
          description: "",
          price: 0, // Using 0 here is fine because z.coerce.number() will handle it
          categoryId: "",
          images: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const handleAddImage = () => {
    if (imageInput.trim() !== "") {
      append({ url: imageInput });
      setImageInput("");
    }
  };

  // 3. Async logic in its own function
  const performSubmit = async (data: ProductFormData) => {
    const submissionData = {
      ...data,
      images: data.images.map((img) => img.url), // Convert objects back to strings
    };

    try {
      if (initialData) {
        await updateProduct({
          id: initialData.id,
          body: submissionData,
        }).unwrap();
      } else {
        await createProduct(submissionData).unwrap();
      }
      router.replace("/products"); // Use replace for both create and update
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  // 4. Synchronous wrapper for handleSubmit (fixes the error)
  const handleFormSubmit: SubmitHandler<ProductFormData> = (data) => {
    performSubmit(data);
  };

  return (
    // 5. Use the new wrapper function
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-ghost-white"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-3 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-burnt-sienna">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="categoryId"
          className="mb-2 block text-sm font-medium text-ghost-white"
        >
          Category
        </label>
        <select
          id="categoryId"
          {...register("categoryId")}
          disabled={isLoadingCategories}
          className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-3 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide disabled:opacity-50"
        >
          <option value="">
            {isLoadingCategories ? "Loading..." : "Select a category"}
          </option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-2 text-sm text-burnt-sienna">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-ghost-white"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-3 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-burnt-sienna">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="mb-2 block text-sm font-medium text-ghost-white"
        >
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price")}
          className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-3 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide"
        />
        {errors.price && (
          <p className="mt-2 text-sm text-burnt-sienna">
            {errors.price.message}
          </p>
        )}
      </div>

      {/* Images */}
      <div>
        <label
          htmlFor="imageInput"
          className="mb-2 block text-sm font-medium text-ghost-white"
        >
          Image URLs
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            id="imageInput"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="https://example.com/image.png"
            className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-3 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="flex-shrink-0 rounded-md bg-tan-hide px-4 font-semibold text-dark-space transition hover:bg-tan-hide/90"
          >
            Add
          </button>
        </div>
        {errors.images && (
          <p className="mt-2 text-sm text-burnt-sienna">
            {errors.images.message}
          </p>
        )}
        <div className="mt-4 space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                {...register(`images.${index}.url` as const)}
                className="w-full rounded-md bg-dark-space/50 p-2 text-ghost-white/70"
                readOnly
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex-shrink-0 rounded-md bg-burnt-sienna px-3 py-2 text-xs font-bold text-ghost-white transition hover:bg-burnt-sienna/90"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-forest-green py-3 font-semibold text-ghost-white transition hover:bg-forest-green/90 focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-forest-green/50"
        >
          {isLoading
            ? "Saving..."
            : initialData
            ? "Save Changes"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
}
