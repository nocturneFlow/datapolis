import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="p-6 shadow-lg backdrop-blur-lg dark:bg-zinc-900 rounded-xl text-center">
        <CardHeader>
          <h1 className="text-7xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            4
            <Ghost className="w-16 h-16 text-gray-600 dark:text-gray-300 animate-pulse" />
            4
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Упс! Страница, которую вы ищете, не существует.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              variant="default"
              className="flex items-center gap-2"
            >
              <Link href="/">
                <Home className="w-5 h-5" /> На главную
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
