"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/home");
    } else {
      const data = await res.json();
      setError(data.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login</h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
