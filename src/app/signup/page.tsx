"use client";

import { useEffect, useState } from "react";
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

  const handleClose = () => {
    // Go back if possible, else home
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

      // Success, go to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    }
  };

  // Click outside the panel to close
  const onOverlayClick = () => handleClose();
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="DialogOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
      onClick={onOverlayClick}
    >
      <section className="DialogPanel" onClick={stop}>
        <header className="DialogHeader">
          <h1 id="signup-title">Sign Up</h1>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="userName">User name:</label>
          <input
            id="userName"
            type="text"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="DialogError">{error}</p>}

          <div className="DialogActions">
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </section>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignupPage() {
//   const router = useRouter();
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [userName, setUserName] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const res = await fetch("/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           password,
//           userName,
//           confirmPassword,
//           firstName,
//           lastName,
//         }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.message || "Signup failed");
//       }

//       // On success, maybe auto-login, or redirect to login:
//       router.push("/dashboard");
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("An unexpected error occurred");
//       }
//     }
//   };

//   return (
//     <main className="auth-container">
//       <h1>Sign Up</h1>
//       <form onSubmit={handleSubmit}>
//         <label>First Name:</label>
//         <input
//           type="text"
//           required
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//         />

//         <label>Last Name:</label>
//         <input
//           type="text"
//           required
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//         />

//         <label>Email:</label>
//         <input
//           type="email"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <label>User name:</label>
//         <input
//           type="text"
//           required
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//         />

//         <label>Password:</label>
//         <input
//           type="password"
//           required
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <label>Confirm Password:</label>
//         <input
//           type="password"
//           required
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />

//         <button type="submit">Sign Up</button>
//       </form>
//       {error && <p className="error">{error}</p>}
//     </main>
//   );
// }
