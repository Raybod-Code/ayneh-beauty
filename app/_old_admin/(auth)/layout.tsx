import { Toaster } from "sonner";

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "font-sans group w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 " +
              "bg-gradient-to-b from-[#141414]/95 to-[#0b0b0b]/95 " +
              "backdrop-blur-md px-4 py-3 " +
              "shadow-[0_22px_70px_rgba(0,0,0,0.75)]",
            title: "font-sans text-sm font-extrabold text-white tracking-wide",
            description: "font-sans text-xs text-gray-300/95 mt-1 leading-relaxed",
            actionButton: "font-sans bg-brand-gold text-black hover:brightness-110 rounded-xl px-3 py-2 text-xs font-bold",
            cancelButton: "font-sans bg-white/5 hover:bg-white/10 border border-white/10 text-gray-100 rounded-xl px-3 py-2 text-xs",
            closeButton: "font-sans bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 rounded-xl px-3 py-2 text-xs",
          },
        }}
      />
    </>
  );
}
