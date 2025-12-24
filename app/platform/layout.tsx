// app/platform/layout.tsx
import PlatformNavbar from "@/components/platform/PlatformNavbar";
import PlatformFooter from "@/components/platform/PlatformFooter";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PlatformNavbar />
      <main>{children}</main>
      <PlatformFooter />
    </>
  );
}
