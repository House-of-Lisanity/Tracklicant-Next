"use client";

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import ResumeCard from "./ResumeCard";
import { scrollToTopIfNeeded } from "@/lib/utils/scrollHelpers";
import { fetchResumes, deleteResume, updateResume } from "@/lib/api/resumes";
import type { Resume, ResumeLibraryHandle } from "@/lib/types/resume";

type ResumeLibraryProps = {
  onEdit: (text: string, id: string) => void;
};

const ResumeLibrary = forwardRef<ResumeLibraryHandle, ResumeLibraryProps>(
  function ResumeLibrary({ onEdit }, ref) {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);

    const showResumes = async () => {
      try {
        const data = await fetchResumes();
        setResumes(data);
      } catch (err) {
        console.error("❌ Error fetching resumes:", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      showResumes();
    }, []);

    useImperativeHandle(ref, () => ({
      refresh: showResumes,
    }));

    const handleDelete = async (id: string) => {
      try {
        await deleteResume(id);
        setResumes((prevResumes) =>
          prevResumes.filter((resume) => resume._id !== id)
        );
        scrollToTopIfNeeded();
      } catch (err) {
        console.error("❌ Failed to delete resume:", err);
      }
    };

    const handleUpdate = async (id: string, updatedResume: Resume) => {
      const { _id, ...resumeWithoutId } = updatedResume;

      try {
        const result = await updateResume(_id!, resumeWithoutId);
        setResumes((prevResumes) =>
          prevResumes.map((resume) =>
            resume._id === id ? { ...resume, ...result } : resume
          )
        );
        scrollToTopIfNeeded();
      } catch (err) {
        console.error("❌ Failed to update resume:", err);
      }
    };

    return (
      <div>
        <div>
          <h3>My Resumes</h3>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : resumes.length > 0 ? (
          <div>
            {resumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onDelete={handleDelete}
                onSave={(updatedResume) =>
                  handleUpdate(resume._id!, updatedResume)
                }
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <p>No resumes saved yet.</p>
        )}
      </div>
    );
  }
);

export default ResumeLibrary;
