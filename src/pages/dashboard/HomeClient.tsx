"use client";

import { useState, useRef } from "react";
import AddJob from "@/app/jobs/AddJob";
import JobLibrary from "@/app/jobs/JobLibrary";
import type { JobLibraryHandle } from "@/lib/types/job";

export default function Home() {
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const tableRef = useRef<JobLibraryHandle>(null);

  const handleRefresh = () => {
    tableRef.current?.refresh();
  };
  return (
    <section id="dashboard">
      <div className="home-container">
        {/* Main Content (full width) */}
        <main className="main-content">
          <JobLibrary ref={tableRef} />
        </main>

        {/* Floating Action Button */}
        <button
          className="fab"
          aria-label="Add a Job"
          onClick={() => setIsAddJobOpen(true)}
        >
          + Add a Job
        </button>

        {/* Modal stays mounted here */}
        <AddJob
          isOpen={isAddJobOpen}
          onClose={() => setIsAddJobOpen(false)}
          onSuccess={handleRefresh}
        />
      </div>
    </section>
  );
}
