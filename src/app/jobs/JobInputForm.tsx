"use client";
import { useForm, Controller } from "react-hook-form";
import { Job } from "@/lib/types/job";
import JobLinkParser from "./JobLinkParser"; // ✅ import your component

type JobFormData = Omit<Job, "_id" | "userId">;

export type JobFormProps = {
  onSubmit: (data: JobFormData, reset: () => void) => void;
  onCancel?: () => void;
};

export default function JobInputForm({ onSubmit, onCancel }: JobFormProps) {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    defaultValues: {
      jobTitle: "",
      company: "",
      postingLink: "",
      status: "",
      appliedDate: "",
      rejectedDate: "",
      resumeVersion: "",
      notes: "",
    },
  });

  const submitHandler = (data: JobFormData) => {
    onSubmit(data, reset);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        {/* Posting Link */}
        <div className="form-group">
          <JobLinkParser
            onParsed={({ jobTitle, company }) => {
              if (jobTitle) {
                setValue("jobTitle", jobTitle, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
              if (company) {
                setValue("company", company, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
          />
        </div>

        {/* Job Title */}
        <div className="form-group">
          <label htmlFor="jobTitle">
            Job Title<span>*</span>
          </label>
          <Controller
            name="jobTitle"
            control={control}
            rules={{ required: "Job title is required" }}
            render={({ field }) => <input {...field} id="jobTitle" />}
          />
          {errors.jobTitle && (
            <p className="DialogError">{errors.jobTitle.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="form-group">
          <label htmlFor="company">
            Company<span>*</span>
          </label>
          <Controller
            name="company"
            control={control}
            rules={{ required: "Company name is required" }}
            render={({ field }) => <input {...field} id="company" />}
          />
          {errors.company && (
            <p className="DialogError">{errors.company.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select {...field} id="status">
                <option value="">Select status</option>
                <option value="interested">Interested</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="withdrawn">Withdrew Application</option>
                <option value="rejected">Not Hired</option>
                <option value="noresponse">No Response from Employer</option>
              </select>
            )}
          />
        </div>

        {/* Date Applied */}
        <div className="form-group">
          <label htmlFor="appliedDate">Date Applied</label>
          <Controller
            name="appliedDate"
            control={control}
            render={({ field }) => (
              <input {...field} id="appliedDate" type="date" />
            )}
          />
        </div>

        {/* Date Rejected */}
        <div className="form-group">
          <label htmlFor="rejectedDate">Date Rejected</label>
          <Controller
            name="rejectedDate"
            control={control}
            render={({ field }) => (
              <input {...field} id="rejectedDate" type="date" />
            )}
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => <textarea {...field} id="notes" />}
          />
        </div>

        {/* Submit / Cancel */}
        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
          <button type="submit" className="btn-secondary">
            Add Job
          </button>
        </div>
      </form>
    </>
  );
}
