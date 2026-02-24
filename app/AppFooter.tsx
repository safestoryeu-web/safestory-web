"use client";

import { useLanguage } from "./LanguageContext";

const footerText = {
  sk: {
    copyright:
      "© 2026 SafeStory.eu. Všetky práva vyhradené. Projekt SafeStory, ilustrácie postáv (Sofia a Olivia) a príbehy sú autorským dielom.",
    contact: "Kontakt: safestoryeu@gmail.com",
  },
  en: {
    copyright:
      "© 2026 SafeStory.eu. All rights reserved. SafeStory project, character illustrations (Sofia and Olivia) and stories are original works.",
    contact: "Contact: safestoryeu@gmail.com",
  },
};

export default function AppFooter() {
  const { language } = useLanguage();
  const t = footerText[language];

  return (
    <footer className="mt-auto shrink-0 py-2 px-4 flex justify-center bg-lime-50/40">
      <p className="text-[10px] md:text-[11px] text-lime-700/85 text-center max-w-3xl">
        {t.copyright}{" "}
        <span className="whitespace-nowrap">{t.contact}</span>
      </p>
    </footer>
  );
}
