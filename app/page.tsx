"use client";

import Image from "next/image";
import Link from "next/link";
import scenarios from "../data/scenarios.json";
import { useLanguage } from "./LanguageContext";

const homeText = {
  sk: {
    welcome:
      "Vitajte vo svete bezpečných dobrodružstiev! Sofia a Olívia sú pripravené. Aktuálne máme v databáze pripravených",
    scenarios: "scenárov",
    start: "Začať hrať",
    about: "O projekte",
  },
  en: {
    welcome:
      "Welcome to the world of safe adventures! Sofia and Olivia are ready. We currently have",
    scenarios: "scenarios",
    start: "Start playing",
    about: "About the project",
  },
};

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const t = homeText[language];
  const count = scenarios.length;

  return (
    <main className="relative min-h-screen bg-[url('/images/background.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      {/* Jazykový prepínač – obrázky vlajok */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1.5 shadow-md border border-white/60">
        <button
          type="button"
          onClick={() => setLanguage("sk")}
          className={`w-10 h-7 rounded overflow-hidden flex items-center justify-center border-2 transition-all shrink-0 ${
            language === "sk"
              ? "border-sky-600 ring-2 ring-sky-400/50"
              : "border-transparent opacity-70 hover:opacity-100"
          }`}
          title="Slovenčina"
          aria-label="Slovenčina"
        >
          <Image
            src="/images/flags/sk.png"
            alt=""
            width={40}
            height={28}
            className="w-full h-full object-cover"
          />
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`w-10 h-7 rounded overflow-hidden flex items-center justify-center border-2 transition-all shrink-0 ${
            language === "en"
              ? "border-sky-600 ring-2 ring-sky-400/50"
              : "border-transparent opacity-70 hover:opacity-100"
          }`}
          title="English"
          aria-label="English"
        >
          <Image
            src="/images/flags/en.png"
            alt=""
            width={40}
            height={28}
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      <div className="absolute bottom-10 left-[-20px] md:left-10 w-40 md:w-80 z-10 transition-all">
        <Image
          src="/images/sofia_full.webp"
          alt="Sofia"
          width={400}
          height={600}
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute bottom-10 right-[-20px] md:right-10 w-40 md:w-80 z-10 transition-all">
        <Image
          src="/images/olivia_full.webp"
          alt="Olívia"
          width={400}
          height={600}
          className="object-contain"
          priority
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center p-4 flex flex-col items-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-sky-900 mb-6 tracking-tight drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
          <span className="text-green-600">Safe</span>Story.eu
        </h1>

        <p className="text-2xl text-slate-800 mb-10 leading-relaxed font-bold drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] max-w-lg">
          {t.welcome}{" "}
          <strong className="text-sky-700">
            {count} {t.scenarios}
          </strong>
          .
        </p>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/play"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-12 rounded-full text-2xl transition-all shadow-[0_8px_30px_rgb(14,165,233,0.4)] hover:shadow-[0_8px_30px_rgb(14,165,233,0.6)] transform hover:-translate-y-1"
          >
            {t.start}
          </Link>
          <Link
            href="/about"
            className="inline-block text-sm md:text-base font-semibold text-sky-900 bg-white/75 border border-sky-200/80 rounded-full py-2 px-6 shadow-sm hover:bg-white hover:border-sky-300 transition-colors"
          >
            {t.about}
          </Link>
        </div>
      </div>
    </main>
  );
}
