import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// Define the shape of a single Product
export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  category: {
    id: string;
    name: string;
  };
}

//Define the shape of the data for creating a new product
export interface NewProduct {
  name: string;
  description: string;
  price: number;
  categoryId: string; // Handle this field later
  images: string[];
}

// NEW: Define the shape for updating a product. It needs the ID and partial data.
export interface UpdateProductPayload {
  id: string;
  body: Partial<{
    name: string;
    description: string;
    price: number;
    categoryId: string;
    images: string[];
  }>;
}

// Create the API service
export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.bitechx.com/",
    // Prepare headers to include the auth token
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product"], // Used for cache invalidation

  endpoints: (builder) => ({
    // Endpoint to get all products with pagination
    getProducts: builder.query<
      Product[],
      { offset: number; limit: number; categoryId?: string }
    >({
      query: ({ offset, limit, categoryId }) => {
        // Start with base pagination
        let queryString = `products?offset=${offset}&limit=${limit}`;
        // Add categoryId if it exists
        if (categoryId) {
          queryString += `&categoryId=${categoryId}`;
        }
        return queryString;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Endpoint searchProducts
    searchProducts: builder.query<Product[], string>({
      query: (searchedText) => `products/search?searchedText=${searchedText}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    //Endpoint to delete a product
    deleteProduct: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      // This invalidates the 'LIST' tag, forcing the getProducts query to refetch
      invalidatesTags: (result, error, id) => [{ type: "Product", id: "LIST" }],
    }),

    //Endpoint to create a product
    createProduct: builder.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "products",
        method: "POST",
        body: newProduct,
      }),
      // This invalidates the 'LIST' tag, forcing the getProducts query to refetch
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Endpoint to get a single product by its slug

    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `products/${slug}`,
      providesTags: (result) =>
        result ? [{ type: "Product", id: result.id }] : [], // Use ID for consistency
    }),

    // NEW: Endpoint to update a product
    updateProduct: builder.mutation<Product, UpdateProductPayload>({
      query: ({ id, body }) => ({
        url: `products/${id}`,
        method: "PUT",
        body,
      }),
      // Invalidates the list and the specific product's cache
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id },
      ],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useGetProductBySlugQuery,
  useUpdateProductMutation,
} = productsApi;
