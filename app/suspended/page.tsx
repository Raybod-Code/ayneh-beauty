// app/suspended/page.tsx
export default function SuspendedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="text-8xl mb-6">🚫</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Account Suspended
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          This salon's subscription has expired or been suspended.
          Please contact support to reactivate your account.
        </p>
        <a 
          href="mailto:support@ayneh.com"
          className="inline-block bg-white text-red-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
