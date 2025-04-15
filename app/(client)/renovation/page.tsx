import Map from "./components/map";

export default function HomePage() {
  return (
    <main className="w-full h-screen">
      <h1 className="text-center text-xl py-4 font-bold">
        Карта участков реновации
      </h1>
      <Map />
    </main>
  );
}
