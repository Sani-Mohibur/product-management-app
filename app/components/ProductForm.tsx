"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
// We no longer import zod or zodResolver
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  Product,
} from "@/app/lib/services/productsService";
import { useGetCategoriesQuery } from "@/app/lib/services/categoriesService";
import { useRouter } from "next/navigation";

// We define our type manually instead of using Zod
type ProductFormData = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: { url: string }[];
};

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
    reset,
  } = useForm<ProductFormData>({
    // We removed the resolver
    defaultValues: {
      name: "",
      description: "",
      price: undefined, // Use undefined for empty number field
      categoryId: "",
      images: [],
    },
  });

  // This hook pre-fills the form for editing
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        categoryId: initialData.category.id,
        images:
          (initialData.images &&
            initialData.images.map((url) => ({ url: url }))) ||
          [],
      });
    }
  }, [initialData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
    // We add our array validation rules here
    rules: {
      minLength: {
        value: 1,
        message: "Please add at least one image URL",
      },
    },
  });

  const handleAddImage = () => {
    if (imageInput.trim() !== "") {
      append({ url: imageInput });
      setImageInput("");
    }
  };

  // This logic remains the same
  const performSubmit = async (data: ProductFormData) => {
    const submissionData = {
      ...data,
      images: data.images.map((img) => img.url),
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
      router.replace("/products");
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  // This wrapper also remains the same
  const handleFormSubmit: SubmitHandler<ProductFormData> = (data) => {
    performSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name: Added built-in validation */}
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
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
          })}
          className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-3 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-burnt-sienna">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Category: Added built-in validation */}
      <div>
        <label
          htmlFor="categoryId"
          className="mb-2 block text-sm font-medium text-ghost-white"
        >
          Category
        </label>
        <select
          id="categoryId"
          {...register("categoryId", {
            required: "Please select a category",
          })}
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

      {/* Description: Added built-in validation */}
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
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
          className="w-full rounded-md border border-tan-hide/50 bg-dark-space p-3 text-ghost-white focus:border-tan-hide focus:outline-none focus:ring-1 focus:ring-tan-hide"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-burnt-sienna">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price: Added built-in validation */}
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
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true, // This converts the input to a number
            min: { value: 0.01, message: "Price must be positive" },
          })}
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
        {/* We now get the array-level error from errors.images.root */}
        {errors.images?.root && (
          <p className="mt-2 text-sm text-burnt-sienna">
            {errors.images.root.message}
          </p>
        )}
        <div className="mt-4 space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                {...register(`images.${index}.url` as const, {
                  required: "URL cannot be empty",
                  pattern: {
                    value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                    message: "Must be a valid URL",
                  },
                })}
                className="w-full rounded-md bg-dark-space/50 p-2 text-ghost-white/70"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex-shrink-0 rounded-md bg-burnt-sienna px-3 py-2 text-xs font-bold text-ghost-white transition hover:bg-burnt-sienna/90"
              >
                Remove
              </button>
              {/* This will show errors for individual image inputs */}
              {errors.images?.[index]?.url && (
                <p className="mt-1 text-xs text-burnt-sienna">
                  {errors.images[index]?.url?.message}
                </p>
              )}
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
