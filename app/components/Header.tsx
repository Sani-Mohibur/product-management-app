"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../lib/features/auth/authSlice";
import { RootState } from "../lib/store";
import Link from "next/link";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Don't show the header if we're not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-dark-space/50 p-4 shadow-md backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/products" className="text-xl font-bold text-ghost-white">
          Product App
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-md bg-burnt-sienna px-4 py-2 font-semibold text-ghost-white transition hover:bg-burnt-sienna/90"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
