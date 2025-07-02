import type { UserProfile } from "@/lib/types/user";

type ATSResumeTemplateProps = {
  profile: UserProfile;
  resume: {
    summary?: string;
    experience: string[]; // or later, Experience[]
    education?: string[]; // overrides
    skills: string[];
    overrides?: Partial<UserProfile>;
  };
};

export default function ATSResumeTemplate({
  profile,
  resume,
}: ATSResumeTemplateProps) {
  const mergedProfile = mergeProfile(profile, resume.overrides || {});

  const {
    fullName,
    email,
    phone,
    location,
    linkedIn,
    github,
    website,
    education: mergedEducation,
  } = mergedProfile;

  const { summary, experience, skills } = resume;

  return (
    <div className="text-left font-serif text-sm text-gray-900 leading-relaxed whitespace-pre-wrap max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase">{fullName}</h1>
        <div className="mt-2 space-y-1 text-sm">
          {location && <p>{location}</p>}
          {phone && <p>Phone: {phone}</p>}
          {email && <p>Email: {email}</p>}
          {linkedIn && <p>LinkedIn: {linkedIn}</p>}
          {github && <p>GitHub: {github}</p>}
          {website && <p>{website}</p>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <>
          <h2 className="font-bold text-base uppercase mb-1">Summary</h2>
          <p className="mb-4">{summary}</p>
        </>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <>
          <h2 className="font-bold text-base uppercase mb-1">Experience</h2>
          <ul className="mb-4 list-disc list-inside">
            {experience.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {/* Education (from profile or resume override) */}
      {mergedEducation.length > 0 && (
        <>
          <h2 className="font-bold text-base uppercase mb-1">Education</h2>
          <ul className="mb-4 list-disc list-inside">
            {mergedEducation.map((item, idx) => (
              <li key={idx}>
                {typeof item === "string"
                  ? item
                  : `${item.degree}, ${item.school}${
                      item.graduationDate ? ` – ${item.graduationDate}` : ""
                    }`}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <>
          <h2 className="font-bold text-base uppercase mb-1">Skills</h2>
          <ul className="list-disc list-inside">
            {skills.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// Helper
function mergeProfile(
  profile: UserProfile,
  overrides: Partial<UserProfile>
): UserProfile {
  return {
    ...profile,
    ...overrides,
    education: overrides.education?.length
      ? overrides.education
      : profile.education,
  };
}
