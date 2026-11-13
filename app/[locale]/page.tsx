import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Chapters from "@/components/Chapters";
import FacilitySection from "@/components/facility/FacilitySection";
import Specs from "@/components/Specs";
import Sustainability from "@/components/Sustainability";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import { getDict, type Locale } from "@/lib/i18n";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDict(locale);
  return (
    <>
      <Header locale={locale as Locale} dict={dict} />
      <main>
        <Hero dict={dict} />
        <Chapters dict={dict} />
        <FacilitySection dict={dict} />
        <Specs dict={dict} />
        <Sustainability dict={dict} />
        <Cta dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
