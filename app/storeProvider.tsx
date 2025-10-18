"use client";

import { useRef, useEffect } from "react"; // 1. Import useEffect
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./lib/store";
import { setToken } from "./lib/features/auth/authSlice"; // 2. Import setToken

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // 3. Add this effect to hydrate the auth state on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Dispatch setToken to re-hydrate the store
        storeRef.current?.dispatch(setToken(token));
      }
    }
  }, []); // The empty array ensures this runs only once on mount

  return <Provider store={storeRef.current}>{children}</Provider>;
}
