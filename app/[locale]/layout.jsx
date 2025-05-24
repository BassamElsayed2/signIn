import { NextIntlClientProvider  } from "next-intl";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}
export async function generateMetadata({ params }) {
  return {
    title: params.locale === 'ar' ? 'تاريخ الحضور' : 'Attendance History',
  };}
export default async function LocaleLayout({ children, params }) {
  let messages;
  try {
    messages = await import(`@/messages/${params.locale}.json`).then(mod => mod.default);
  } catch {
    messages = await import(`@/messages/en.json`).then(mod => mod.default);
  }

  return (
    <NextIntlClientProvider  locale={params.locale} messages={messages}>
      {children}
    </NextIntlClientProvider >
  );
}
