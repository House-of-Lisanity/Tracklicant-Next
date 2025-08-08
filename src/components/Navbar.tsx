"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/styles/components/navbar.scss";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Left: Logo */}
        <Link href="/" className="logo-link">
          <Image
            src="/gold_logo_nobg.png"
            alt="Tracklicant Logo"
            width={40}
            height={40}
          />
          <span className="logo-text">Tracklicant</span>
        </Link>

        {!isLoginPage && (
          <>
            {/* Center (hidden on small) */}
            <nav className="nav-links">
              <Link href="/">Home</Link>
              {/* <Link href="/resumes">Resumes</Link> */}
              <Link href="/profile">Profile</Link>
            </nav>

            {/* Right: Logout */}
            <div className="nav-right">
              <button className="logout-link" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      {!isLoginPage && isMenuOpen && (
        <nav className="mobile-menu">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          {/* <Link href="/resumes" onClick={() => setIsMenuOpen(false)}>
            Resumes
          </Link> */}
          <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
            Profile
          </Link>
        </nav>
      )}
    </header>
  );
}
