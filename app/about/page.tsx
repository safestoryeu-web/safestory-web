import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[url('/images/background.webp')] bg-cover bg-center bg-fixed flex flex-col items-center justify-center py-8 px-4 font-sans text-slate-900">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl p-8 md:p-12 border-2 border-white/60 text-center relative">
        
        {/* Tlačidlo späť */}
        <div className="absolute top-6 left-6">
          <Link href="/" className="text-teal-600 hover:text-teal-800 font-bold flex items-center gap-2 transition-colors">
            ⬅ Späť
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 mt-8 md:mt-0">
          O projekte{' '}
          <span className="text-green-600">Safe</span>
          <span className="text-sky-700">Story</span>
        </h1>
        
        <div className="text-lg md:text-xl text-slate-700 leading-relaxed space-y-6 mb-10 text-left">
          <p>
            Tento projekt vznikol z čistej otcovskej lásky k mojim dvom dcéram, dvojičkám <strong>Sofii a Olívii</strong>. 
            Ako každý rodič, aj ja chcem, aby moje deti boli v bezpečí, keď objavujú svet. 
          </p>
          <p>
            Uvedomil som si, že poučovanie a zákazy často nefungujú. Deti sa najlepšie učia cez príbehy a hru. 
            Preto som vytvoril <strong>SafeStory.eu</strong> - interaktívne prostredie, kde si deti môžu hravou formou 
            nacvičiť, ako správne a bezpečne reagovať v rôznych životných situáciách.
          </p>
          <p>
            Všetky scenáre sme spoločne s dievčatami poctivo otestovali a verím, že pomôžu aj ďalším rodičom 
            otvoriť s deťmi dôležité témy o bezpečnosti.
          </p>
        </div>

        {/* Sekcia podpory */}
        <div className="bg-teal-50 rounded-2xl p-8 border-2 border-teal-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Podporte náš projekt</h2>
          <p className="text-slate-600 mb-6">
            Aplikácia je pre všetkých rodičov a deti zadarmo. Ak vám však naše príbehy aspoň trochu pomohli otvoriť s vašimi deťmi dôležité témy o bezpečnosti a vidíte v tomto projekte zmysel, budem nesmierne vďačný za akúkoľvek drobnú podporu. 
            Vaša symbolická 'káva' mi pomôže pokryť náklady na web a dodá mi energiu do tvorby ďalších užitočných scenárov. Ďakujem, otec Martin ❤️
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Revolut tlačidlo */}
            <a 
              href="https://revolut.me/safestory" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full transition-transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2"
            >
              <span>Podporiť cez Revolut ☕</span>
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}