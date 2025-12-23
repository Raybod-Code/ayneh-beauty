// import AdminShell from "@/components/admin/AdminShell";
// import AdminTransitions from "@/components/admin/AdminTransitions";
// import { requireTenantRole } from "@/lib/auth/tenant-role";

// export default async function ProtectedAdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // هر کسی به /admin/(protected) می‌آید، باید حداقل member باشد
//   await requireTenantRole(["owner", "admin", "secretary"]);

//   return (
//     <AdminShell>
//       <AdminTransitions>{children}</AdminTransitions>
//     </AdminShell>
//   );
// }
import { requireTenantRole } from "@/lib/auth/tenant-role";
// تغییر مهم اینجاست: آکولاد {} را بردارید
import AdminShell from "@/components/admin/AdminShell"; 
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireTenantRole(["owner", "admin", "secretary"]);

  if (!ctx || !ctx.user) {
    redirect("/admin/login");
  }

  return (
    <AdminShell user={ctx.user} role={ctx.role}>
      {children}
    </AdminShell>
  );
}
