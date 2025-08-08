import { useState } from "react";
import type { UserProfile, EducationEntry } from "@/lib/types/user";

type Props = {
  initialData?: UserProfile;
  onSave: (profile: UserProfile) => void;
};

export default function UserProfileForm({ initialData, onSave }: Props) {
  const [profile, setProfile] = useState<UserProfile>(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      hashedPassword: "",
      phone: "",
      location: "",
      linkedIn: "",
      github: "",
      website: "",
      education: [],
      masterSkills: [],
    }
  );

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationEntry,
    value: string
  ) => {
    const updated = [...profile.education];
    updated[index] = { ...updated[index], [field]: value };
    setProfile((prev) => ({ ...prev, education: updated }));
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", school: "", graduationDate: "" },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    const updated = profile.education.filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, education: updated }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(profile);
      }}
      className="space-y-4 p-4 max-w-xl"
    >
      <h2 className="text-2xl font-bold">User Profile</h2>

      {/* Contact Info */}
      <input
        type="text"
        placeholder="First Name"
        value={profile.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="text"
        placeholder="Last Name"
        value={profile.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="email"
        placeholder="Email"
        value={profile.email}
        onChange={(e) => handleChange("email", e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="text"
        placeholder="Phone (optional)"
        value={profile.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="text"
        placeholder="Location"
        value={profile.location}
        onChange={(e) => handleChange("location", e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="text"
        placeholder="LinkedIn URL"
        value={profile.linkedIn}
        onChange={(e) => handleChange("linkedIn", e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="text"
        placeholder="GitHub URL"
        value={profile.github}
        onChange={(e) => handleChange("github", e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="text"
        placeholder="Personal Website"
        value={profile.website}
        onChange={(e) => handleChange("website", e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="text"
        placeholder="Skills (comma-separated)"
        value={profile.masterSkills?.join(", ")}
        onChange={(e) => handleChange("masterSkills", e.target.value)}
        className="w-full p-2 border"
      />

      {/* Education Section */}
      <h3 className="text-xl font-semibold mt-6">Education</h3>

      {profile.education.map((edu, index) => (
        <div key={index} className="border p-3 rounded space-y-2">
          <input
            type="text"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) =>
              handleEducationChange(index, "degree", e.target.value)
            }
            className="w-full p-2 border"
          />
          <input
            type="text"
            placeholder="School"
            value={edu.school}
            onChange={(e) =>
              handleEducationChange(index, "school", e.target.value)
            }
            className="w-full p-2 border"
          />
          <input
            type="text"
            placeholder="Graduation Date"
            value={edu.graduationDate}
            onChange={(e) =>
              handleEducationChange(index, "graduationDate", e.target.value)
            }
            className="w-full p-2 border"
          />
          <button
            type="button"
            onClick={() => removeEducation(index)}
            className="text-red-600 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="text-blue-600 mt-2 text-sm"
      >
        + Add Another Education Entry
      </button>

      <div className="pt-4">
        <button
          type="submit"
          className="bg-[var(--gold)] text-[var(--blue)] px-4 py-2 font-bold uppercase"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
}
