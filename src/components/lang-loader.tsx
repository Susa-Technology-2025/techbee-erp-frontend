import { ReactNode } from "react";
import initTranslations from "@/lib/i18n/i18n";
import TranslationsProvider from "./translation-provider";

type Params = {
  params: Promise<{
    locale: string;
  }>;
  children: (t: (key: string) => string) => ReactNode;
  translation_group: string[];
};

export default async function LangLoader({
  params,
  children,
  translation_group,
}: Params) {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, translation_group);

  return (
    <>
      <TranslationsProvider
        namespaces={translation_group}
        locale={locale}
        resources={resources}
      >
        {children(t)}
      </TranslationsProvider>
    </>
  );
}
