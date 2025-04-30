import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import AdminDashboard from "./admin-dashboard";

export default async function AdminPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return <AdminDashboard dictionary={dictionary} />;
}
