import type { Metadata } from "next";
import "../styles/globals.scss";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <Navbar />
      <body>
        <div className="layout-root">
          <main className="layout-main">{children}</main>
        </div>
      </body>
      <Footer />
    </html>
  );
}
