import { redirect } from "next/navigation";

export default function RootPage() {
  // TODO: Check onboarding_complete from DB — for now redirect to home
  redirect("/(app)/home");
}
