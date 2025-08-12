// // src/pages/UserProfilePage.tsx

// import { useState, useEffect } from "react";
// import UserProfileForm from "../users/UserProfileForm";
// import { UserProfile } from "../../lib/types/user";

// export default function UserProfilePage() {
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [saved, setSaved] = useState(false);

//   // TEMPORARY: Load from localStorage for now
//   useEffect(() => {
//     const savedData = localStorage.getItem("userProfile");
//     if (savedData) {
//       setProfile(JSON.parse(savedData));
//     } else {
//       setProfile({
//         firstName: "",
//         lastName: "",
//         email: "",
//         hashedPassword: "",
//         phone: "",
//         location: "",
//         linkedIn: "",
//         github: "",
//         website: "",
//         education: [],
//       });
//     }
//   }, []);

//   const handleSave = (updatedProfile: UserProfile) => {
//     localStorage.setItem("userProfile", JSON.stringify(updatedProfile)); // Replace with Mongo call later
//     setProfile(updatedProfile);
//     setSaved(true);
//     setTimeout(() => setSaved(false), 3000);
//   };

//   if (!profile) return <p>Loading...</p>;

//   return (
//     <div className="max-w-3xl mx-auto mt-10 px-4">
//       <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
//       <UserProfileForm initialData={profile} onSave={handleSave} />
//       {saved && <p className="text-green-600 mt-4">✅ Profile saved!</p>}
//     </div>
//   );
// }
