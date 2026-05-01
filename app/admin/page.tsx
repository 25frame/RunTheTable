import { redirect } from "next/navigation";

/** Redirect /admin to login; prevents old Apps Script JSON behavior. */
export default function AdminRootPage() {
  redirect("/admin/login");
}
