"use client";

import Link from "next/link";
import { useLanguage } from "../LanguageContext";

const aboutText = {
  sk: {
    back: "Späť",
    titleAbout: "O projekte",
    p1: "Tento projekt vznikol z čistej otcovskej lásky k mojim dvom dcéram, dvojičkám",
    p1Bold: "Sofii a Olívii",
    p1End: "Ako každý rodič, aj ja chcem, aby moje deti boli v bezpečí, keď objavujú svet.",
    p2: "Uvedomil som si, že poučovanie a zákazy často nefungujú. Deti sa najlepšie učia cez príbehy a hru. Preto som vytvoril",
    p2Bold: "SafeStory.eu",
    p2End: "– interaktívne prostredie, kde si deti môžu hravou formou nacvičiť, ako správne a bezpečne reagovať v rôznych životných situáciách.",
    p3: "Všetky scenáre sme spoločne s dievčatami poctivo otestovali a verím, že pomôžu aj ďalším rodičom otvoriť s deťmi dôležité témy o bezpečnosti.",
    supportTitle: "Podporte náš projekt",
    supportPara:
      "Aplikácia je pre všetkých rodičov a deti zadarmo. Ak vám však naše príbehy aspoň trochu pomohli otvoriť s vašimi deťmi dôležité témy o bezpečnosti a vidíte v tomto projekte zmysel, budem nesmierne vďačný za akúkoľvek drobnú podporu. Vaša symbolická 'káva' mi pomôže pokryť náklady na web a dodá mi energiu do tvorby ďalších užitočných scenárov. Ďakujem, otec Martin ❤️",
    revolut: "Podporiť cez Revolut ☕",
    orKoFi: "Alebo ma môžete podporiť kávou na",
  },
  en: {
    back: "Back",
    titleAbout: "About the project",
    p1: "This project was born from pure fatherly love for my two daughters, twins",
    p1Bold: "Sofia and Olivia",
    p1End: "Like every parent, I want my children to be safe as they explore the world.",
    p2: "I realised that lecturing and rules often don't work. Children learn best through stories and play. So I created",
    p2Bold: "SafeStory.eu",
    p2End: "– an interactive space where children can practise how to react safely in different real-life situations.",
    p3: "We've tested all the scenarios together with the girls and I believe they will help other parents open up important safety topics with their children.",
    supportTitle: "Support our project",
    supportPara:
      "The app is free for all parents and children. If our stories have helped you a little to open up safety topics with your kids and you see value in this project, I would be very grateful for any small support. Your symbolic 'coffee' helps cover the cost of the website and gives me energy to create more useful scenarios. Thank you, father Martin ❤️",
    revolut: "Support via Revolut ☕",
    orKoFi: "Or you can buy me a coffee on",
  },
};

export default function AboutPage() {
  const { language } = useLanguage();
  const t = aboutText[language];

  return (
    <main className="min-h-screen bg-[url('/images/background.webp')] bg-cover bg-center bg-fixed flex flex-col items-center justify-center py-8 px-4 font-sans text-slate-900">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl p-8 md:p-12 border-2 border-white/60 text-center relative">
        <div className="absolute top-6 left-6">
          <Link href="/" className="text-teal-600 hover:text-teal-800 font-bold flex items-center gap-2 transition-colors">
            ⬅ {t.back}
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 mt-8 md:mt-0">
          {t.titleAbout}{" "}
          <span className="text-green-600">Safe</span>
          <span className="text-sky-700">Story</span>
        </h1>

        <div className="text-lg md:text-xl text-slate-700 leading-relaxed space-y-6 mb-10 text-left">
          <p>
            {t.p1} <strong>{t.p1Bold}</strong>. {t.p1End}
          </p>
          <p>
            {t.p2} <strong>{t.p2Bold}</strong> {t.p2End}
          </p>
          <p>{t.p3}</p>
        </div>

        <div className="bg-teal-50 rounded-2xl p-8 border-2 border-teal-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{t.supportTitle}</h2>
          <p className="text-slate-600 mb-6">{t.supportPara}</p>

          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://revolut.me/safestory"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full transition-transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2"
              >
                <span>{t.revolut}</span>
              </a>
            </div>
            <p className="text-slate-600 text-sm">
              {t.orKoFi}{" "}
              <a
                href="https://ko-fi.com/safestory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-800 font-semibold underline underline-offset-2"
              >
                Ko-fi
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
