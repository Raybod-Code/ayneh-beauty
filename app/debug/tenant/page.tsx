import { getTenantFromRequest } from "@/lib/tenant/get-tenant";

export default async function TenantDebugPage() {
  const { tenantSlug, tenant } = await getTenantFromRequest();

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Tenant Debug</h1>
      <pre>{JSON.stringify({ tenantSlug, tenant }, null, 2)}</pre>
    </main>
  );
}
