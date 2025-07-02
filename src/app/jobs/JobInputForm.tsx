"use client";
import { useForm, Controller } from "react-hook-form";
import { Job } from "@/lib/types/job";
import { parseJobLink } from "@/lib/api/jobs";
import { useState } from "react";
import ResumeSelector from "@/app/jobs/ResumeSelector";

type JobFormData = Omit<Job, "_id">;

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
  const [parsing, setParsing] = useState(false);

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Posting Link */}
      <div>
        <label className="block font-medium">
          Posting Link<span className="text-red-500">*</span>
        </label>
        <Controller
          name="postingLink"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-full border rounded px-3 py-2"
              // placeholder="Paste job posting link..."
              type="text"
              onBlur={async () => {
                if (field.value) {
                  setParsing(true);
                  try {
                    const { jobTitle, company } = await parseJobLink(
                      field.value
                    );
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
                  } catch (err) {
                    console.error("❌ Failed to parse job link", err);
                  } finally {
                    setParsing(false);
                  }
                }
              }}
            />
          )}
        />
      </div>

      <div>
        <label className="block font-medium">
          Job Title<span className="text-red-500">*</span>
        </label>
        <Controller
          name="jobTitle"
          control={control}
          rules={{ required: "Job title is required" }}
          render={({ field }) => (
            <input
              {...field}
              className="w-full border rounded px-3 py-2"
              placeholder={parsing ? "Getting job info..." : " "}
            />
          )}
        />
        {errors.jobTitle && (
          <p className="text-red-600 text-sm">{errors.jobTitle.message}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <label className="block font-medium">
          Company<span className="text-red-500">*</span>
        </label>
        <Controller
          name="company"
          control={control}
          rules={{ required: "Company name is required" }}
          render={({ field }) => (
            <input
              {...field}
              className="w-full border rounded px-3 py-2"
              placeholder={parsing ? "Getting job info..." : " "}
            />
          )}
        />
        {errors.company && (
          <p className="text-red-600 text-sm">{errors.company.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block font-medium">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <select {...field} className="w-full border rounded px-3 py-2">
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
      <div>
        <label className="block font-medium">Date Applied</label>
        <Controller
          name="appliedDate"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-full border rounded px-3 py-2"
              type="date"
            />
          )}
        />
      </div>

      {/* Date Rejected */}
      <div>
        <label className="block font-medium">Date Rejected</label>
        <Controller
          name="rejectedDate"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-full border rounded px-3 py-2"
              type="date"
            />
          )}
        />
      </div>

      {/* Resume Version */}
      <div>
        <label className="block font-medium">Resume Version</label>
        <ResumeSelector onSelect={(id) => setValue("resumeVersion", id)} />
      </div>

      {/* Notes */}
      <div>
        <label className="block font-medium">Notes</label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="w-full border rounded px-3 py-2"
              // placeholder="e.g., Follow up in 2 weeks"
            />
          )}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-between pt-4">
        <button type="submit">Add Job</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
