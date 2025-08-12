import { useState } from "react";
import { ParsedJobInfo } from "@/lib/types/job";

type Props = {
  onParsed: (data: ParsedJobInfo) => void;
};

export default function JobLinkParser({ onParsed }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      if (data.error) {
        setError(
          "We couldn't parse this link, but you can still fill it in manually."
        );
        return;
      }

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
    <div className="form-group">
      <label htmlFor="postingLink">
        Posting Link<span>*</span>
      </label>
      <input
        type="text"
        value={url}
        required
        onChange={(e) => setUrl(e.target.value)}
        onBlur={() => {
          if (url) handleParse();
        }}
        placeholder="Paste job posting link..."
      />
      <div className="form-actions">
        <button
          type="button"
          onClick={handleParse}
          disabled={loading || !url}
          className="btn-secondary"
        >
          {loading ? "Parsing..." : "Get Job Info"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
