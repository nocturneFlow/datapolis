"use client";

import { useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import ThreeBackground from "@/components/ThreeBackground";
import { Button } from "@/components/ui/button";
import { LineChart } from "recharts";
import Link from "next/link";

const FadeInSection = ({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-100px 0px",
  });

  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: `translateY(${isInView ? 0 : 30}px)`,
        transition: `all 0.8s ease-out ${delay}s`,
      }}
      className="w-full"
    >
      {children}
    </div>
  );
};

export default function Home() {
  return (
    <div className="w-full p-0 m-0 font-sans text-gray-900 bg-white">
      <section className="relative h-screen bg-gray-50 px-8 overflow-hidden">
        <ThreeBackground />

        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-center">
          <h1
            className="text-6xl font-bold tracking-tight md:text-7xl"
            style={{
              opacity: 1,
              transition: "opacity 1s ease-out",
              color: "inherit",
            }}
          >
            Datapolis
          </h1>
          <p
            className="text-3xl font-light mt-4 tracking-tight"
            style={{
              opacity: 1,
              transition: "opacity 1s ease-out",
              color: "inherit",
            }}
          >
            Увидеть город.
          </p>
        </div>

        <button
          onClick={() => {
            document.querySelector("#what-is-section")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="text-3xl absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer bg-transparent border-none z-10 opacity-0"
          style={{
            opacity: 1,
            transition: "opacity 1s ease-out",
            color: "inherit",
          }}
        >
          ↓
        </button>
      </section>

      {/* What Is Section */}
      <FadeInSection>
        <section
          id="what-is-section"
          className="py-24 px-8 max-w-7xl mx-auto border-b border-gray-100"
        >
          <h2 className="text-4xl font-bold mb-12 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[60px] after:h-1 after:bg-gray-900">
            Что это?
          </h2>
          <p className="text-xl leading-relaxed max-w-3xl">
            Datapolis — платформа, которая показывает, где в городе сосредоточен
            успех. Здесь видно, какие районы приносят больше всего налогов, где
            растёт бизнес и какие отрасли двигают экономику. Не догадки —
            данные.
          </p>
        </section>
      </FadeInSection>

      {/* Features Section */}
      <FadeInSection delay={0.2}>
        <section className="py-24 px-8 max-w-7xl mx-auto border-b border-gray-100">
          <h2 className="text-4xl font-bold mb-12 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[60px] after:h-1 after:bg-gray-900">
            Что умеет?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              "Показывает районы с наибольшими налоговыми поступлениями",
              "Выявляет концентрацию активного и крупного бизнеса",
              "Анализирует отраслевую структуру по территориям",
              "Визуализирует экономические центры города",
              "Даёт инструмент для оценки и планирования на всех уровнях",
            ].map((text, index) => (
              <div
                key={index}
                className="group bg-gray-50 p-8 rounded shadow-sm text-lg leading-relaxed h-full relative overflow-hidden transition-all duration-500 ease-out hover:scale-105"
                style={{ transformOrigin: "center" }}
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
                <p className="relative z-10 transition-colors duration-500 group-hover:text-white">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* For Who Section */}
      <FadeInSection delay={0.3}>
        <section className="py-24 px-8 max-w-7xl mx-auto border-b border-gray-100">
          <h2 className="text-4xl font-bold mb-12 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[60px] after:h-1 after:bg-gray-900">
            Для кого?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              {
                title: "Госорганы",
                description:
                  "чтобы понимать, где работает экономика, и усиливать рост",
              },
              {
                title: "Бизнес",
                description: "чтобы видеть, где быть",
              },
              {
                title: "Градостроители",
                description: "чтобы планировать развитие умно",
              },
              {
                title: "Аналитики",
                description: "чтобы опираться на данные, а не догадки",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="pl-6 border-l-4 border-gray-900 py-4 relative overflow-hidden group hover:border-primary transition-all duration-500 ease-out hover:scale-105"
                style={{ transformOrigin: "center" }}
              >
                <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 transition-colors duration-500 group-hover:text-gray-900">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Wide card at the bottom */}
            <div
              className="pl-6 border-l-4 border-gray-900 py-4 lg:col-span-4 relative overflow-hidden group hover:border-primary transition-all duration-500 ease-out hover:scale-105"
              style={{ transformOrigin: "center" }}
            >
              <div
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"
                style={{
                  background:
                    "linear-gradient(to right, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0.2) 50%,  white 100%)",
                }}
              ></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 transition-colors duration-500 ">
                  Горожане
                </h3>
                <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-500">
                  чтобы понимать, где рождается городское будущее
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Why Important Section */}
      <FadeInSection delay={0.4}>
        <section className="py-24 px-8 pb-32 max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[60px] after:h-1 after:bg-gray-900">
            Почему это важно?
          </h2>
          <p className="text-2xl leading-relaxed max-w-3xl mx-auto mb-12">
            Город — это не просто дома и дороги. Это экономика, люди и решения,
            которые работают — или нет. Datapolis помогает увидеть, где город
            живёт на полную мощность.
          </p>
          <Link href="/renovation">
            <Button
              className="bg-primary text-white py-4 px-8 text-lg font-semibold rounded cursor-pointer hover:scale-105 transition-all duration-500 ease-out "
              style={{
                transform: "scale(1)",
                transition: "transform 0.2s ease-out",
              }}
            >
              Изучить платформу
            </Button>
          </Link>
        </section>
      </FadeInSection>
    </div>
  );
}
