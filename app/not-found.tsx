import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-gradient-to-b from-transparent to-gray-50 dark:to-zinc-950">
      <Card className="max-w-xl w-full p-6 shadow-lg backdrop-blur-lg border-2 border-gray-200 dark:border-zinc-700 dark:bg-zinc-900/70 rounded-xl">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gray-100 dark:bg-zinc-800">
            <AlertCircle className="w-10 h-10 text-red-700 dark:text-gray-300 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Страница не найдена
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Запрашиваемая страница не существует или была перемещена.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4" /> Назад
              </Link>
            </Button>
            <Button
              asChild
              variant="default"
              className="flex items-center gap-2"
            >
              <Link href="/">
                <Home className="w-4 h-4" /> На главную
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
