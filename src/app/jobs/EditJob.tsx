import { useForm, Controller } from "react-hook-form";
import { Job } from "@/lib/types/job";

type EditJobModalProps = {
  isOpen: boolean;
  job: Job;
  onClose: () => void;
  onSave: (updatedJob: Job) => void;
};

export default function EditJobModal({
  isOpen,
  job,
  onClose,
  onSave,
}: EditJobModalProps) {
  const { control, handleSubmit } = useForm<Job>({
    defaultValues: { ...job },
  });

  if (!isOpen) return null;

  const submitHandler = (data: Job) => {
    onSave({ ...data, _id: job._id });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-xl shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>
        <p>You only need to fill out the fields you want to update.</p>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {/* Job Title */}
          <div>
            <label className="block font-medium">Job Title</label>
            <Controller
              name="jobTitle"
              control={control}
              render={({ field }) => (
                <input {...field} className="w-full border rounded px-3 py-2" />
              )}
            />
          </div>

          {/* Company */}
          <div>
            <label className="block font-medium">Company</label>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <input {...field} className="w-full border rounded px-3 py-2" />
              )}
            />
          </div>

          {/* Posting Link */}
          <div>
            <label className="block font-medium">Posting Link</label>
            <Controller
              name="postingLink"
              control={control}
              render={({ field }) => (
                <input {...field} className="w-full border rounded px-3 py-2" />
              )}
            />
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
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="withdrawn">Withdrew Application</option>
                  <option value="rejected">Not Hired</option>
                  <option value="noresponse">No Response from Employer</option>
                </select>
              )}
            />
          </div>

          {/* Resume Version */}
          <div>
            <label className="block font-medium">Resume Version</label>
            <Controller
              name="resumeVersion"
              control={control}
              render={({ field }) => (
                <input {...field} className="w-full border rounded px-3 py-2" />
              )}
            />
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
                />
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
