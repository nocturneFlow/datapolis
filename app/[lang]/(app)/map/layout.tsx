export const metadata = { title: "Interactive Map Project" };

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen w-full overscroll-none">{children}</div>;
}
