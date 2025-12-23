import { requireTenantRole } from "@/lib/auth/tenant-role";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // منشی هم می‌تواند
  await requireTenantRole(["owner", "admin", "secretary"]);
  return children;
}
