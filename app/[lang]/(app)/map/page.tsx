// app/page.tsx
"use client";
import Map from "@/components/Map";

export default function HomePage() {
  return (
    <main>
      <Map initialZoom={12} initialCenter={[-73.9857, 40.7484]} />
    </main>
  );
}
