"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hiddenNavPaths = ["/login", "/404", "/not-found"];
  const hideNavbar = !hiddenNavPaths.includes(pathname);

  return (
    <>
      {hideNavbar ? (
        <main className={hideNavbar ? "pt-16" : ""}>
          <NavBar />
          {children}
        </main>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
