"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          userName,
          confirmPassword,
          firstName,
          lastName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Signup failed");
      }

      // On success, maybe auto-login, or redirect to login:
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <main className="auth-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label>Last Name:</label>
        <input
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>User name:</label>
        <input
          type="text"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password:</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error">{error}</p>}
    </main>
  );
}
