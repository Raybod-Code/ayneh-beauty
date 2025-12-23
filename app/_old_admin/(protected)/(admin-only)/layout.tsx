import { requireTenantRole } from "@/lib/auth/tenant-role";

export default async function AdminOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // فقط owner و admin
  await requireTenantRole(["owner", "admin"]);
  return children;
}
