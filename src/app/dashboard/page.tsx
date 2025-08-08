import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import HomeClient from "./HomeClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    verifyToken(token);
  } catch {
    redirect("/login");
  }

  return <HomeClient />;
}
