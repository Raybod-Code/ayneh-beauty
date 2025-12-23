import { redirect } from "next/navigation";
import { requireSuperAdmin } from "../../lib/auth/super-admin";

export default async function SuperAdminIndex() {
  await requireSuperAdmin();
  redirect("/superadmin/dashboard");
}
