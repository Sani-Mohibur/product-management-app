# Product Management App

A modern web application built with Next.js (App Router) to manage products (CRUD operations) with authentication, search, pagination, filtering, and validation.

## Goal

The main goal was to build a polished Next.js application allowing users to browse, create, edit, view details, and delete products, focusing on UI/UX, validation, and clean code using a specific tech stack and mock API.

## Tech Stack

* **Framework:** Next.js 14+ (App Router)
* **Library:** React 18+
* **State Management:** Redux Toolkit (with RTK Query for data fetching)
* **Styling:** Tailwind CSS v4
* **Language:** TypeScript
* **Form Management:** React Hook Form (for built-in validation)
* **Linting:** ESLint

## Features Implemented

* **Authentication:** Simple email-based JWT authentication (Login/Logout). Token persisted in `localStorage`.
* **Product CRUD:**
    * **List Products:** Display products with pagination.
    * **Search Products:** Real-time search by product name (debounced).
    * **Filter Products:** Filter products by category using a dropdown.
    * **View Product Details:** Dedicated page for single product information.
    * **Create Product:** Form with client-side validation for name, description, price, category, and image URLs.
    * **Edit Product:** Reusable form pre-filled with existing data for updates.
    * **Delete Product:** Functionality with a confirmation modal on both the list and details pages.
* **Routing:** Utilizes Next.js App Router with Route Groups (`(auth)`, `(main)`) and dynamic routes (`[slug]`). URL updates for pagination and filtering to support browser history.
* **State Management:** Centralized state using Redux Toolkit, including RTK Query for efficient data fetching, caching, and automatic refetching after mutations.
* **UI/UX:**
    * Responsive design (Mobile/Desktop).
    * Consistent styling based on the provided color palette (`#0D1821`, `#EFF1F3`, `#4E6E5D`, `#AD8A64`, `#A44A3F`).
    * Clear loading and error states for data operations.
    * User-friendly navigation and form handling.
    * Gradient background and improved login page UI.

## Getting Started

### Prerequisites

* Node.js (v18 or later recommended)
* npm or yarn or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/Sani-Mohibur/product-management-app.git](https://github.com/Sani-Mohibur/product-management-app.git)
    ```
2.  Navigate into the project directory:
    ```bash
    cd product-management-app
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

### Running the Development Server

1.  Run the development server:
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the application. The app will automatically redirect you to `/login`.

### Authentication Email

Use the email `mohiburrahmansani@gmail.com` to log in, as required by the mock API.

## Deployment

* **Live URL:** [https://product-management-app-azure.vercel.app/login](https://product-management-app-azure.vercel.app/login)
* **GitHub Repository:** [https://github.com/Sani-Mohibur/product-management-app](https://github.com/Sani-Mohibur/product-management-app)

Deployed via Vercel.

## Potential Future Improvements

* Implement toast notifications for user feedback.
* Add skeleton loaders for better perceived performance.
* Implement product sorting.
* Add automated tests (Unit/Integration).
* Refactor product card into a reusable component.
* Enhance form UX with image previews and unsaved changes warnings.
