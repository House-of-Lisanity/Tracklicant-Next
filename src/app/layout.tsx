import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Tracklicant",
  description: "Track jobs, resumes, and wins—beautifully.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="layout-root">
          <Navbar />
          <main className="layout-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
