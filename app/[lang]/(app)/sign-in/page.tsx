import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import LoginForm from "./login-form";

export default async function SignInPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return <LoginForm dictionary={dictionary} />;
}
