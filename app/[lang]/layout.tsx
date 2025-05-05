import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { i18n, type Locale } from "@/i18n-config";

import "@/app/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { MapProvider } from "@/contexts/map-context";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Datapolis",
  description:
    "Datapolis is a web application that provides a platform for data visualization and analysis.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const { children, params } = props;
  // Extract the lang parameter before using it in JSX
  const lang = params.lang;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MapProvider>{children}</MapProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
