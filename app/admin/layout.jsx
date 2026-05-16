import AdminShell from "@/components/AdminShell";

// Never statically prerender admin routes — always render at request time
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
