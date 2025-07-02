"use client";

import { useState, useRef } from "react";
import AddJob from "@/app/jobs/AddJob";
import JobLibrary from "@/app/jobs/JobLibrary";
import type { JobLibraryHandle } from "@/lib/types/job";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const tableRef = useRef<JobLibraryHandle>(null);
  const router = useRouter();

  const handleRefresh = () => {
    tableRef.current?.refresh();
  };

  return (
    <div className="home-container">
      {/* Sidebar Menu */}
      <aside className="sidebar">
        <nav className="menu-list">
          <button onClick={() => setIsAddJobOpen(true)}>+ Add a Job</button>
          <button onClick={() => router.push("/resumes")}>Go to Resumes</button>
        </nav>
        <AddJob
          isOpen={isAddJobOpen}
          onClose={() => setIsAddJobOpen(false)}
          onSuccess={handleRefresh}
        />
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <JobLibrary ref={tableRef} />
      </main>
    </div>
  );
}
