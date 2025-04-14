import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQs | Datapolis",
  description:
    "Explore geographic information system analytics and data visualization",
};

export default function FAQsPage() {
  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center ">
        Часто задаваемые вопросы
      </h1>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem
          value="item-1"
          className="border rounded-lg px-4 shadow-sm hover:shadow-md transition-all"
        >
          <AccordionTrigger className="text-lg font-semibold py-4 hover:text-primary">
            Как выбрать участок из выпадающего списка?
          </AccordionTrigger>
          <AccordionContent className="text-lg pb-4">
            <div className="pl-2 border-l-2 border-primary/70">
              Выберите участок, кликнув по выпадающему списку и выбрав один из
              доступных вариантов. Система автоматически сфокусируется на
              выбранном участке на карте.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className="border rounded-lg px-4 shadow-sm hover:shadow-md transition-all"
        >
          <AccordionTrigger className="text-lg font-semibold py-4 hover:text-primary">
            Как получить информацию о конкретном участке?
          </AccordionTrigger>
          <AccordionContent className="text-lg pb-4">
            <div className="pl-2 border-l-2 border-primary/70">
              Просто кликните по любому участку на карте — подробная информация
              отобразится в левой панели интерфейса.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className="border rounded-lg px-4 shadow-sm hover:shadow-md transition-all"
        >
          <AccordionTrigger className="text-lg font-semibold py-4 hover:text-primary">
            Где отображается информация об участке?
          </AccordionTrigger>
          <AccordionContent className="text-lg pb-4">
            <div className="pl-2 border-l-2 border-primary/70">
              Вся информация о выбранном участке отображается в левой панели
              интерфейса. Это включает границы, собственника, зонирование и
              другие данные.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-4"
          className="border rounded-lg px-4 shadow-sm hover:shadow-md transition-all"
        >
          <AccordionTrigger className="text-lg font-semibold py-4 hover:text-primary">
            Как сбросить карту и удалить нарисованные полигоны?
          </AccordionTrigger>
          <AccordionContent className="text-lg pb-4">
            <div className="pl-2 border-l-2 border-primary/70">
              Чтобы удалить все выделения и нарисованные полигоны, нажмите
              кнопку «Сбросить». Карта вернётся в исходное состояние.
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-5"
          className="border rounded-lg px-4 shadow-sm hover:shadow-md transition-all"
        >
          <AccordionTrigger className="text-lg font-semibold py-4 hover:text-primary">
            Можно ли развернуть карту на весь экран?
          </AccordionTrigger>
          <AccordionContent className="text-lg pb-4">
            <div className="pl-2 border-l-2 border-primary/70">
              Да, для удобства просмотра нажмите кнопку «Полный экран», чтобы
              развернуть карту. Нажмите ESC или снова кнопку, чтобы выйти из
              полноэкранного режима.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
