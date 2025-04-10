"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

const FadeInSection = ({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="w-full p-0 m-0 font-sans text-gray-900 bg-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center relative h-screen bg-gray-50 px-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold m-0 tracking-tight md:text-7xl"
        >
          Datapolis
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-3xl font-light mt-4 tracking-tight"
        >
          Увидеть город.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-3xl absolute bottom-8 animate-bounce"
        >
          ↓
        </motion.div>
      </section>

      {/* What Is Section */}
      <FadeInSection>
        <section className="py-24 px-8 max-w-7xl mx-auto border-b border-gray-100">
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
            <motion.div
              className="bg-gray-50 p-8 rounded shadow-sm text-lg leading-relaxed h-full"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Показывает районы с наибольшими налоговыми поступлениями
            </motion.div>
            <motion.div
              className="bg-gray-50 p-8 rounded shadow-sm text-lg leading-relaxed h-full"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Выявляет концентрацию активного и крупного бизнеса
            </motion.div>
            <motion.div
              className="bg-gray-50 p-8 rounded shadow-sm text-lg leading-relaxed h-full"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Анализирует отраслевую структуру по территориям
            </motion.div>
            <motion.div
              className="bg-gray-50 p-8 rounded shadow-sm text-lg leading-relaxed h-full"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Визуализирует экономические центры города
            </motion.div>
            <motion.div
              className="bg-gray-50 p-8 rounded shadow-sm text-lg leading-relaxed h-full"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Даёт инструмент для оценки и планирования на всех уровнях
            </motion.div>
          </div>
        </section>
      </FadeInSection>

      {/* For Who Section */}
      <FadeInSection delay={0.3}>
        <section className="py-24 px-8 max-w-7xl mx-auto border-b border-gray-100">
          <h2 className="text-4xl font-bold mb-12 relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-[60px] after:h-1 after:bg-gray-900">
            Для кого?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 ">
            <div className="pl-6 border-l-4 border-gray-900 py-4 hover:border-[#2563EB]">
              <h3 className="text-2xl font-bold mb-4">Госорганы</h3>
              <p className="text-gray-600">
                чтобы понимать, где работает экономика, и усиливать рост
              </p>
            </div>
            <div className="pl-6 border-l-4 border-gray-900 py-4 hover:border-[#2563EB]">
              <h3 className="text-2xl font-bold mb-4">Бизнес</h3>
              <p className="text-gray-600">чтобы видеть, где быть</p>
            </div>
            <div className="pl-6 border-l-4 border-gray-900 py-4 hover:border-[#2563EB]">
              <h3 className="text-2xl font-bold mb-4">Градостроители</h3>
              <p className="text-gray-600">чтобы планировать развитие умно</p>
            </div>
            <div className="pl-6 border-l-4 border-gray-900 py-4 hover:border-[#2563EB]">
              <h3 className="text-2xl font-bold mb-4">Аналитики</h3>
              <p className="text-gray-600">
                чтобы опираться на данные, а не догадки
              </p>
            </div>
            <div className="pl-6 border-l-4 border-gray-900 py-4 lg:col-span-4">
              <h3 className="text-2xl font-bold mb-4">Горожане</h3>
              <p className="text-gray-600">
                чтобы понимать, где рождается городское будущее
              </p>
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
          <motion.button
            className="bg-gray-900 text-white py-4 px-8 text-lg font-semibold rounded cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Изучить платформу
          </motion.button>
        </section>
      </FadeInSection>
    </div>
  );
}
