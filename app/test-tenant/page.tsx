// app/test-tenant/page.tsx
import { getTenantFromRequest } from "@/lib/tenant/get-tenant";
import { headers } from "next/headers";
import { CheckCircle, XCircle, Server, Database, Globe } from "lucide-react";

export const metadata = {
  title: "Tenant Detection Test | Ayneh",
};

export default async function TestTenantPage() {
  const h = await headers();
  const hostname = h.get("host") || "unknown";
  const tenantSlug = h.get("x-ayneh-tenant") || "none";
  
  const tenant = await getTenantFromRequest();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A951]/10 border border-[#C8A951]/20 rounded-full mb-6">
            <Database className="w-4 h-4 text-[#C8A951]" />
            <span className="text-sm text-[#C8A951] font-sans">
              Tenant Detection Test
            </span>
          </div>

          <h1 className="font-playfair text-5xl font-bold mb-4">
            بررسی <span className="text-[#C8A951]">Multi-Tenant</span>
          </h1>
        </div>

        {/* Request Info */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-6 h-6 text-[#C8A951]" />
            <h2 className="font-playfair text-2xl font-bold">اطلاعات درخواست</h2>
          </div>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500">Hostname:</span>
              <span className="text-[#C8A951]">{hostname}</span>
            </div>
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500">Tenant Slug:</span>
              <span className="text-[#C8A951]">{tenantSlug}</span>
            </div>
          </div>
        </div>

        {/* Result */}
        {tenant ? (
          <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <h2 className="font-playfair text-3xl font-bold text-green-400">
                Tenant یافت شد!
              </h2>
            </div>
            
            <pre className="bg-black/50 p-6 rounded-xl overflow-auto text-xs border border-white/5">
              {JSON.stringify(tenant, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
              <h2 className="font-playfair text-3xl font-bold text-red-400">
                Tenant یافت نشد
              </h2>
            </div>
            
            <ul className="space-y-2 text-gray-400 font-sans">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                Middleware تنظیم نشده
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                Tenant در دیتابیس وجود ندارد
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                Tenant غیرفعال است
              </li>
            </ul>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-8">
          <h3 className="font-playfair text-xl font-bold mb-4 text-blue-400">
            دستورالعمل تست
          </h3>
          <ol className="space-y-3 text-gray-300 font-sans">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400">
                1
              </span>
              <span>
                دسترسی به: <code className="text-[#C8A951] bg-black/30 px-2 py-1 rounded">http://localhost:3000/test-tenant</code>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs text-blue-400">
                2
              </span>
              <span>
                تست subdomain: <code className="text-[#C8A951] bg-black/30 px-2 py-1 rounded">http://royal.localhost:3000/test-tenant</code>
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
