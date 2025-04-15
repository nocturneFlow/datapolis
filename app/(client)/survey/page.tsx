// "use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Syrvey | Datapolis",
  description:
    "Explore geographic information system analytics and data visualization",
};

export default function SurveyPage() {
  // const [submitted, setSubmitted] = useState(false);
  // const [fullySurveyCompleted, setFullySurveyCompleted] = useState(false);
  // const [currentSection, setCurrentSection] = useState(1);
  // const totalSections = 2;

  // const checkboxStyles =
  //   "size-5 border-2 hover:border-primary/80 hover:bg-primary/10";
  // const radioStyles =
  //   "size-5 border-2 hover:border-primary/80 hover:bg-primary/10";

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (currentSection < totalSections) {
  //     setSubmitted(true);
  //   } else {
  //     setFullySurveyCompleted(true);
  //   }
  // };

  // const nextSection = () => {
  //   if (currentSection < totalSections) {
  //     setCurrentSection(currentSection + 1);
  //     window.scrollTo(0, 0);
  //   }
  // };

  // const prevSection = () => {
  //   if (currentSection > 1) {
  //     setCurrentSection(currentSection - 1);
  //     window.scrollTo(0, 0);
  //   }
  // };

  // if (fullySurveyCompleted) {
  //   return (
  //     <div className="container max-w-4xl py-12 mx-auto text-center">
  //       <Card className="p-10 shadow-md">
  //         <h2 className="text-3xl font-bold mb-4 text-primary">
  //           Спасибо за прохождение опроса!
  //         </h2>
  //         <p className="text-lg mb-6">
  //           Ваши ответы были успешно отправлены. Ваше мнение очень важно для нас
  //           и поможет нам улучшить планирование и развитие района.
  //         </p>
  //         <Button onClick={() => (window.location.href = "/")} className="mt-4">
  //           Вернуться на главную
  //         </Button>
  //       </Card>
  //     </div>
  //   );
  // }

  // if (submitted) {
  //   return (
  //     <div className="container max-w-4xl py-12 mx-auto text-center">
  //       <Card className="p-10 shadow-md">
  //         <h2 className="text-3xl font-bold mb-4 text-primary">
  //           Вы закончили первый раздел!
  //         </h2>
  //         <p className="text-lg mb-6">
  //           Пожалуйста, уделите несколько минут, чтобы ответить на оставшиеся
  //           вопросы. Ваше мнение очень важно для нас и поможет учесть ваши
  //           пожелания при планировании.
  //         </p>
  //         <Button onClick={() => setSubmitted(false)} className="mt-4">
  //           Перейти к разделу 2
  //         </Button>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Будущее района: ваши пожелания и предложения
      </h1>

      <Card className="p-6 mb-8 bg-primary/5">
        <p className="text-lg">
          Уважаемые жители, мы проводим опрос для выяснения ваших предпочтений
          относительно будущего вашего района после программы реновации. Ваше
          мнение очень важно для нас, и поможет учесть ваши пожелания при
          разработке проекта. Пожалуйста, уделите несколько минут для ответа на
          вопросы.
        </p>
        <Link
          href="https://docs.google.com/forms/d/12UUfYiMZy4wKr0ISb9E-ZVApyjZEOPGJqGnbN-xI0rY/edit?ts=66f11e65"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>Пройти опрос</Button>
        </Link>
      </Card>

      {/* <div className="flex justify-end mb-6 sticky top-14 z-10">
        <div className="rounded-4xl max-w-36 border-solid border-2 sticky top-14 z-10 bg-trasparent backdrop-blur-2xl p-3 mb-6 shadow-sm ">
          <div className="text-center">
            <p className="text-sm font-medium mb-1">
              Раздел {currentSection} из {totalSections}
            </p>
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: totalSections }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-16 rounded-full ${
                    index < currentSection ? "bg-primary" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* <form onSubmit={handleSubmit} className="space-y-8">
        {currentSection === 1 && (
          <div>
            <div className="space-y-6 mb-10">
              <h2 className="text-2xl font-semibold border-b pb-2">
                Блок 1: Социальные объекты
              </h2>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  1. Какие новые социальные объекты вам были бы наиболее полезны
                  в районе?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-top space-x-2">
                    <Checkbox id="schools" className={checkboxStyles} />
                    <Label htmlFor="schools" className="font-normal">
                      Школы
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="kindergartens" className={checkboxStyles} />
                    <Label htmlFor="kindergartens" className="font-normal">
                      Детские сады
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="clinics" className={checkboxStyles} />
                    <Label htmlFor="clinics" className="font-normal">
                      Поликлиники
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="sports" className={checkboxStyles} />
                    <Label htmlFor="sports" className="font-normal">
                      Спортивные объекты
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="culture" className={checkboxStyles} />
                    <Label htmlFor="culture" className="font-normal">
                      Культурные учреждения (музеи, театры)
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="social-other" className={checkboxStyles} />
                    <Label htmlFor="social-other" className="font-normal">
                      Другое
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  2. Насколько вы удовлетворены текущим количеством социальных
                  объектов в вашем районе?
                </Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="fully-satisfied"
                      id="fully-satisfied"
                      className={radioStyles}
                    />
                    <Label htmlFor="fully-satisfied">
                      Полностью удовлетворен
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="partially-satisfied"
                      id="partially-satisfied"
                      className={radioStyles}
                    />
                    <Label htmlFor="partially-satisfied">
                      Частично удовлетворен
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="not-satisfied"
                      id="not-satisfied"
                      className={radioStyles}
                    />
                    <Label htmlFor="not-satisfied">Не удовлетворен</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="satisfaction-other"
                      id="satisfaction-other"
                      className={radioStyles}
                    />
                    <Label htmlFor="satisfaction-other">Другое</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            
            <div className="space-y-6 mb-10">
              <h2 className="text-2xl font-semibold border-b pb-2">
                Блок 2: Общественные пространства
              </h2>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  3. Какие общественные пространства вы хотели бы видеть в
                  районе?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-top space-x-2">
                    <Checkbox id="parks" className={checkboxStyles} />
                    <Label htmlFor="parks" className="font-normal">
                      Парки и скверы
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="playgrounds" className={checkboxStyles} />
                    <Label htmlFor="playgrounds" className="font-normal">
                      Детские площадки
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="dog-areas" className={checkboxStyles} />
                    <Label htmlFor="dog-areas" className="font-normal">
                      Зоны для выгула собак
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="sport-grounds" className={checkboxStyles} />
                    <Label htmlFor="sport-grounds" className="font-normal">
                      Спортивные площадки на открытом воздухе
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="rest-spaces" className={checkboxStyles} />
                    <Label htmlFor="rest-spaces" className="font-normal">
                      Пространства для отдыха (беседки, лавочки)
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="public-other" className={checkboxStyles} />
                    <Label htmlFor="public-other" className="font-normal">
                      Другое
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <h2 className="text-2xl font-semibold border-b pb-2">
                Блок 3: Объекты малого и среднего бизнеса
              </h2>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  4. Какие объекты малого и среднего бизнеса вы бы хотели видеть
                  в районе?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-top space-x-2">
                    <Checkbox id="shops" className={checkboxStyles} />
                    <Label htmlFor="shops" className="font-normal">
                      Магазины
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="cafes" className={checkboxStyles} />
                    <Label htmlFor="cafes" className="font-normal">
                      Кафе и рестораны
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="pharmacies" className={checkboxStyles} />
                    <Label htmlFor="pharmacies" className="font-normal">
                      Аптеки
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="beauty" className={checkboxStyles} />
                    <Label htmlFor="beauty" className="font-normal">
                      Салоны красоты
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="game-clubs" className={checkboxStyles} />
                    <Label htmlFor="game-clubs" className="font-normal">
                      Игровые клубы
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="edu-centers" className={checkboxStyles} />
                    <Label htmlFor="edu-centers" className="font-normal">
                      Образовательные центры
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="coworking" className={checkboxStyles} />
                    <Label htmlFor="coworking" className="font-normal">
                      Коворкинги и антикафе
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="business-other" className={checkboxStyles} />
                    <Label htmlFor="business-other" className="font-normal">
                      Другое
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <h2 className="text-2xl font-semibold border-b pb-2">
                Блок 4: Благоустройство
              </h2>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  5. Какие элементы благоустройства вам важны?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-top space-x-2">
                    <Checkbox id="landscaping" className={checkboxStyles} />
                    <Label htmlFor="landscaping" className="font-normal">
                      Озеленение (деревья, кустарники)
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="lighting" className={checkboxStyles} />
                    <Label htmlFor="lighting" className="font-normal">
                      Освещение
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="benches" className={checkboxStyles} />
                    <Label htmlFor="benches" className="font-normal">
                      Скамейки и урны
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="bike-paths" className={checkboxStyles} />
                    <Label htmlFor="bike-paths" className="font-normal">
                      Велодорожки
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="rest-areas" className={checkboxStyles} />
                    <Label htmlFor="rest-areas" className="font-normal">
                      Пространства для отдыха (беседки, лавочки)
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="landscape-other" className={checkboxStyles} />
                    <Label htmlFor="landscape-other" className="font-normal">
                      Другое
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <h2 className="text-2xl font-semibold border-b pb-2">
                Блок 5: Инфраструктура
              </h2>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  6. Какие изменения в инфраструктуре вам кажутся приоритетными?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-top space-x-2">
                    <Checkbox
                      id="infrastructure-landscaping"
                      className={checkboxStyles}
                    />
                    <Label
                      htmlFor="infrastructure-landscaping"
                      className="font-normal"
                    >
                      Озеленение (деревья, кустарники)
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox
                      id="infrastructure-lighting"
                      className={checkboxStyles}
                    />
                    <Label
                      htmlFor="infrastructure-lighting"
                      className="font-normal"
                    >
                      Освещение
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox
                      id="infrastructure-benches"
                      className={checkboxStyles}
                    />
                    <Label
                      htmlFor="infrastructure-benches"
                      className="font-normal"
                    >
                      Скамейки и урны
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox
                      id="infrastructure-bike-paths"
                      className={checkboxStyles}
                    />
                    <Label
                      htmlFor="infrastructure-bike-paths"
                      className="font-normal"
                    >
                      Велодорожки
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox
                      id="infrastructure-rest-areas"
                      className={checkboxStyles}
                    />
                    <Label
                      htmlFor="infrastructure-rest-areas"
                      className="font-normal"
                    >
                      Пространства для отдыха (беседки, лавочки)
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox
                      id="infrastructure-other"
                      className={checkboxStyles}
                    />
                    <Label
                      htmlFor="infrastructure-other"
                      className="font-normal"
                    >
                      Другое
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <Label className="text-base font-medium">
                  7. Насколько вы удовлетворены качеством электроснабжения в
                  вашем районе?
                </Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="power-fully-satisfied"
                      id="power-fully-satisfied"
                      className={radioStyles}
                    />
                    <Label htmlFor="power-fully-satisfied">
                      Полностью удовлетворен
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="power-partially-satisfied"
                      id="power-partially-satisfied"
                      className={radioStyles}
                    />
                    <Label htmlFor="power-partially-satisfied">
                      Частично удовлетворен
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="power-not-satisfied"
                      id="power-not-satisfied"
                      className={radioStyles}
                    />
                    <Label htmlFor="power-not-satisfied">Не удовлетворен</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="power-other"
                      id="power-other"
                      className={radioStyles}
                    />
                    <Label htmlFor="power-other">Другое</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3 mt-4">
                <Label className="text-base font-medium">
                  8. Какие улучшения в системе электроснабжения вы считаете
                  важными?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-top space-x-2">
                    <Checkbox id="power-increase" className={checkboxStyles} />
                    <Label htmlFor="power-increase" className="font-normal">
                      Увеличение мощности электросетей
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="power-replace" className={checkboxStyles} />
                    <Label htmlFor="power-replace" className="font-normal">
                      Замена старых линий и оборудования
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="power-backup" className={checkboxStyles} />
                    <Label htmlFor="power-backup" className="font-normal">
                      Резервные источники питания
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="power-other" className={checkboxStyles} />
                    <Label htmlFor="power-other" className="font-normal">
                      Другое
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <h2 className="text-2xl font-semibold border-b pb-2">
                Блок 6: Безопасность
              </h2>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  9. Как вы оцениваете уровень безопасности в вашем районе?
                </Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="very-safe"
                      id="very-safe"
                      className={radioStyles}
                    />
                    <Label htmlFor="very-safe">Очень безопасно</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="safe-enough"
                      id="safe-enough"
                      className={radioStyles}
                    />
                    <Label htmlFor="safe-enough">Достаточно безопасно</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="neutral"
                      id="neutral"
                      className={radioStyles}
                    />
                    <Label htmlFor="neutral">Нейтрально</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="not-very-safe"
                      id="not-very-safe"
                      className={radioStyles}
                    />
                    <Label htmlFor="not-very-safe">Не очень безопасно</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="dangerous"
                      id="dangerous"
                      className={radioStyles}
                    />
                    <Label htmlFor="dangerous">Опасно</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3 mt-4">
                <Label className="text-base font-medium">
                  10. Какие меры безопасности вы считаете наиболее важными для
                  вашего района?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-top space-x-2">
                    <Checkbox id="safety-cameras" className={checkboxStyles} />
                    <Label htmlFor="safety-cameras" className="font-normal">
                      Установка дополнительных камер наблюдения Сергек
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="safety-lighting" className={checkboxStyles} />
                    <Label htmlFor="safety-lighting" className="font-normal">
                      Улучшение освещённости улиц
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="safety-sos" className={checkboxStyles} />
                    <Label htmlFor="safety-sos" className="font-normal">
                      Установка дополнительных кнопок SOS
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="safety-police" className={checkboxStyles} />
                    <Label htmlFor="safety-police" className="font-normal">
                      Расширение сети полицейских пунктов
                    </Label>
                  </div>
                  <div className="flex items-top space-x-2">
                    <Checkbox id="safety-other" className={checkboxStyles} />
                    <Label htmlFor="safety-other" className="font-normal">
                      Другое
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <Label className="text-base font-medium">
                  11. Как вы относитесь к внедрению умных светофоров для
                  повышения безопасности на дорогах?
                </Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="positive"
                      id="positive"
                      className={radioStyles}
                    />
                    <Label htmlFor="positive">Положительно</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="neutral-smart"
                      id="neutral-smart"
                      className={radioStyles}
                    />
                    <Label htmlFor="neutral-smart">Нейтрально</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="negative"
                      id="negative"
                      className={radioStyles}
                    />
                    <Label htmlFor="negative">Отрицательно</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3 mt-4">
                <Label className="text-base font-medium">
                  12. Какое одно изменение в районе было бы для вас самым
                  важным?
                </Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="transport"
                      id="transport"
                      className={radioStyles}
                    />
                    <Label htmlFor="transport">
                      Улучшение транспортной доступности
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="roads"
                      id="roads"
                      className={radioStyles}
                    />
                    <Label htmlFor="roads">
                      Улучшение качества дорог и создание парковочных мест
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="safety-increase"
                      id="safety-increase"
                      className={radioStyles}
                    />
                    <Label htmlFor="safety-increase">
                      Повышение уровня безопасности (камеры, освещение, полиция)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="medical"
                      id="medical"
                      className={radioStyles}
                    />
                    <Label htmlFor="medical">
                      Развитие медицинской инфраструктуры (новые поликлиники)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="power-improvement"
                      id="power-improvement"
                      className={radioStyles}
                    />
                    <Label htmlFor="power-improvement">
                      Улучшение электроснабжения
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="recreation"
                      id="recreation"
                      className={radioStyles}
                    />
                    <Label htmlFor="recreation">
                      Развитие мест для отдыха и общественных пространств
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="small-business"
                      id="small-business"
                      className={radioStyles}
                    />
                    <Label htmlFor="small-business">
                      Развитие объектов малого бизнеса (магазины, кафе, салоны
                      красоты)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="it-cluster"
                      id="it-cluster"
                      className={radioStyles}
                    />
                    <Label htmlFor="it-cluster">
                      Создание кластера информационных технологий
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="education-cluster"
                      id="education-cluster"
                      className={radioStyles}
                    />
                    <Label htmlFor="education-cluster">
                      Создание кластера образовательных услуг
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="entertainment"
                      id="entertainment"
                      className={radioStyles}
                    />
                    <Label htmlFor="entertainment">
                      Создание развлекательных центров
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="important-other"
                      id="important-other"
                      className={radioStyles}
                    />
                    <Label htmlFor="important-other">Другое</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {currentSection === 2 && (
          <div>
            <h2 className="text-2xl font-semibold border-b pb-2 mb-6">
              Ваша роль в обществе
            </h2>

            <div className="space-y-3">
              <Label className="text-base font-medium">
                Какой из перечисленных вариантов лучше всего описывает вашу
                текущую роль?
              </Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="age-18-30"
                    id="age-18-30"
                    className={radioStyles}
                  />
                  <Label htmlFor="age-18-30">
                    Человек в возрасте 18-30 лет
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="family"
                    id="family"
                    className={radioStyles}
                  />
                  <Label htmlFor="family">Семейный человек</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="single"
                    id="single"
                    className={radioStyles}
                  />
                  <Label htmlFor="single">Не женат/не замужем</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="teen"
                    id="teen"
                    className={radioStyles}
                  />
                  <Label htmlFor="teen">Подросток (13-17 лет)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="retired"
                    id="retired"
                    className={radioStyles}
                  />
                  <Label htmlFor="retired">На пенсии</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="freelancer"
                    id="freelancer"
                    className={radioStyles}
                  />
                  <Label htmlFor="freelancer">Фрилансер</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="employed"
                    id="employed"
                    className={radioStyles}
                  />
                  <Label htmlFor="employed">Работаю в организации</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="role-other"
                    id="role-other"
                    className={radioStyles}
                  />
                  <Label htmlFor="role-other">Другое</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3 mt-6">
              <Label className="text-base font-medium">
                К какой возрастной категории вы себя относите?
              </Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="under-20"
                    id="under-20"
                    className={radioStyles}
                  />
                  <Label htmlFor="under-20">младше 20 лет</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="20-30"
                    id="20-30"
                    className={radioStyles}
                  />
                  <Label htmlFor="20-30">20 - 30 лет</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="30-40"
                    id="30-40"
                    className={radioStyles}
                  />
                  <Label htmlFor="30-40">30 - 40 лет</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="40-50"
                    id="40-50"
                    className={radioStyles}
                  />
                  <Label htmlFor="40-50">40 - 50 лет</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="50-60"
                    id="50-60"
                    className={radioStyles}
                  />
                  <Label htmlFor="50-60">50 - 60 лет</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="60-70"
                    id="60-70"
                    className={radioStyles}
                  />
                  <Label htmlFor="60-70">60 - 70 лет</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="over-70"
                    id="over-70"
                    className={radioStyles}
                  />
                  <Label htmlFor="over-70">старше 70 лет</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3 mt-6">
              <Label className="text-base font-medium">
                К какой категории по уровню дохода вы себя относите (по уровню
                расходов в месяц)?
              </Label>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="under-150k"
                    id="under-150k"
                    className={radioStyles}
                  />
                  <Label htmlFor="under-150k">до 150 тыс. тенге</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="150-200k"
                    id="150-200k"
                    className={radioStyles}
                  />
                  <Label htmlFor="150-200k">150 - 200 тыс. тенге</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="200-250k"
                    id="200-250k"
                    className={radioStyles}
                  />
                  <Label htmlFor="200-250k">200 - 250 тыс. тенге</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="250-400k"
                    id="250-400k"
                    className={radioStyles}
                  />
                  <Label htmlFor="250-400k">250 - 400 тыс. тенге</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="400-600k"
                    id="400-600k"
                    className={radioStyles}
                  />
                  <Label htmlFor="400-600k">400 - 600 тыс. тенге</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="600-800k"
                    id="600-800k"
                    className={radioStyles}
                  />
                  <Label htmlFor="600-800k">600 - 800 тыс. тенге</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="800-1000k"
                    id="800-1000k"
                    className={radioStyles}
                  />
                  <Label htmlFor="800-1000k">800 - 1000 тыс. тенге</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="over-1m"
                    id="over-1m"
                    className={radioStyles}
                  />
                  <Label htmlFor="over-1m">более 1 млн. тенге</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10">
          {currentSection > 1 && (
            <Button type="button" onClick={prevSection} variant="outline">
              Назад
            </Button>
          )}
          {currentSection < totalSections ? (
            <Button type="button" onClick={nextSection} className="ml-auto">
              Перейти к разделу {currentSection + 1}
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Завершить опрос
            </Button>
          )}
        </div>
      </form> */}
    </div>
  );
}
