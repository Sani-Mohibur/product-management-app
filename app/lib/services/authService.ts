// Define the shape of the successful response
interface AuthResponse {
  token: string;
}

// Define the shape of the error response
interface ErrorResponse {
  message: string;
}

export const loginUser = async (email: string): Promise<string> => {
  try {
    const response = await fetch("https://api.bitechx.com/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || "An unknown error occurred.");
    }

    const data: AuthResponse = await response.json();
    return data.token;
  } catch (error) {
    console.error("Login failed:", error);
    // Re-throw the error to be handled by the component
    throw error;
  }
};
