import { useState } from "react";
import { ParsedJobInfo } from "@/lib/types/job";

type Props = {
  onParsed: (data: ParsedJobInfo) => void;
};

export default function JobLinkParser({ onParsed }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  const handleParse = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setTitle(data.title || "");
      setCompany(data.company || "");
      onParsed({ jobTitle: data.title, company: data.company });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">Job Posting URL</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Paste job posting link..."
      />
      <button
        type="button"
        onClick={handleParse}
        disabled={loading || !url}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Parsing..." : "Parse"}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {(title || company) && (
        <div className="mt-4 space-y-2">
          <label className="block font-medium">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <label className="block font-medium">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
      )}
    </div>
  );
}
