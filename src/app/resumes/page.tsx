"use client";

import { useState, useRef } from "react";
import ResumeLibrary from "@/app/resumes/ResumeLibrary";
import type { ResumeLibraryHandle } from "@/lib/types/resume";
import ResumeBuilder from "@/app/resumes/ResumeBuilder";
import ResumeEditor from "@/app/resumes/ResumeEditor";
import ResumeNameModal from "@/app/resumes/ResumeNameModal";
import { addResume } from "@/lib/api/resumes";
import type { NewResume } from "@/lib/types/resume";

export default function ResumePage() {
  /** ===============================
   * STATE MANAGEMENT
   * =============================== */
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeId, setResumeId] = useState<string | undefined>(undefined);
  const [parsedText, setParsedText] = useState<string>("");
  const [resumeName, setResumeName] = useState<string>("");
  const tableRef = useRef<ResumeLibraryHandle>(null);

  /** ===============================
   * BUILDER HANDLERS
   * =============================== */
  const handleOpenBuilder = () => setIsBuilderOpen(true);
  const handleCloseBuilder = () => setIsBuilderOpen(false);

  /** ===============================
   * EDITOR HANDLERS
   * =============================== */
  const handleCloseEditor = () => setIsEditorOpen(false);

  const handleOpenEditor = (text: string, id: string) => {
    setParsedText(text);
    setResumeId(id);
    setIsEditing(true);
    setIsEditorOpen(true);
  };

  const handleEditParsedText = (text: string) => {
    setParsedText(text);
  };

  const handleParsedResume = (parsedData: {
    summary?: string;
    experience?: string[];
    education?: string[];
    skills?: string[];
  }) => {
    console.log("Parsed resume data received:", parsedData);
    setParsedText(
      [
        parsedData.summary,
        ...(parsedData.experience || []),
        ...(parsedData.education || []),
        ...(parsedData.skills || []),
      ]
        .filter(Boolean)
        .join("\n\n")
    );
    setIsEditing(false);
    setIsEditorOpen(true);
  };

  /** ===============================
   * MODAL FLOW HANDLERS
   * =============================== */
  const handleRequestName = () => {
    console.log("Requesting name for resume");
    setIsEditorOpen(false);
    setShowNameModal(true);
  };

  const handleConfirm = async (name: string) => {
    await saveResumetoDB(name);
    setShowNameModal(false);
    setResumeName(""); // ✅ Reset for next time
    onSaveSuccess();
  };

  /** ===============================
   * SAVE + REFRESH HELPERS
   * =============================== */
  const saveResumetoDB = async (resumeName: string) => {
    try {
      const resumeData: NewResume = {
        name: resumeName,
        content: parsedText,
      };
      const response = await addResume(resumeData);
      console.log("Resume saved successfully:", response);
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  const handleRefresh = () => {
    tableRef.current?.refresh();
  };

  const onSaveSuccess = () => {
    handleRefresh();
    setIsEditorOpen(false);
    setParsedText("");
  };

  return (
    <>
      <div className="home-container">
        {/* Sidebar Menu */}
        <aside className="sidebar">
          <nav className="menu-list">
            <button onClick={handleOpenBuilder}>+ Upload Resume</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <ResumeLibrary
            ref={tableRef}
            onEdit={(text, id) => handleOpenEditor(text, id)}
          />
        </main>
      </div>
      <ResumeBuilder
        isOpen={isBuilderOpen}
        onClose={handleCloseBuilder}
        onParsed={handleParsedResume}
        onSuccess={handleRefresh}
      />
      <ResumeEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        content={parsedText}
        onEdit={handleEditParsedText}
        resumeId={resumeId}
        isEditing={isEditing}
        onSaveSuccess={handleRefresh}
        onRequestName={handleRequestName}
      />
      <ResumeNameModal
        isOpen={showNameModal}
        resumeName={resumeName}
        setResumeName={setResumeName}
        onConfirm={handleConfirm}
        onCancel={() => setShowNameModal(false)}
      />
    </>
  );
}
