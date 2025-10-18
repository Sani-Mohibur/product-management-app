import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// Define the shape of a single Category
export interface Category {
  id: string;
  name: string;
  image: string;
}

// Create the API service
export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
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
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // Endpoint to get all categories
    getCategories: builder.query<Category[], void>({
      query: () => "categories",
      providesTags: ["Category"],
    }),
  }),
});

// Export the auto-generated hook
export const { useGetCategoriesQuery } = categoriesApi;
