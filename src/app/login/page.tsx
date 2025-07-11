"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../contexts/AppContext";
import { login } from "../../../lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = login(email, password);

    if (user) {
      dispatch({ type: "SET_USER", payload: user });
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-sm text-gray-600">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-black/80 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 p-4 bg-gray-200 rounded-lg text-sm text-black/90">
          <strong>Demo Credentials:</strong>
          <br />
          Email: admin@example.com
          <br />
          Password: admin123
        </div>
      </div>
    </div>
  );
}
