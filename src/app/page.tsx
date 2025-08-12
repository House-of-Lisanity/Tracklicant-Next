"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <main className="landing-page">
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to Tracklicant!</h1>
            <p className="tagline">
              A simple job application tracker where all you need is a job link.
              Easily keep track of actions, dates, notes, all in one place.
            </p>
            <div className="cta-buttons">
              <Link href="/login" className="btn">
                Log In
              </Link>
              <Link href="/signup" className="btn btn-secondary">
                Sign Up
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
