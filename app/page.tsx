import Image from 'next/image';
import scenarios from '../data/scenarios.json';
import Link from 'next/link';

export default function Home() {
  return (
    // HLAVNÝ OBAL: Tu sme nastavili tvoj nový obrázok ako pozadie na celú obrazovku
    <main className="relative min-h-screen bg-[url('/images/background.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* --- POSTAVA SOFIA (VĽAVO) --- */}
      <div className="hidden lg:block absolute bottom-0 left-[-2%] w-[42%] h-[85%] z-0 pointer-events-none">
        <Image 
          src="/images/sofia_full.webp" 
          alt="Sofia"
          fill
          className="object-contain object-bottom drop-shadow-2xl"
          priority
        />
      </div>

      {/* --- POSTAVA OLÍVIA (VPRAVO) --- */}
      <div className="hidden lg:block absolute bottom-0 right-[-2%] w-[42%] h-[85%] z-0 pointer-events-none">
        <Image 
          src="/images/olivia_full.webp" 
          alt="Olívia"
          fill
          className="object-contain object-bottom drop-shadow-2xl"
          priority
        />
      </div>

      {/* --- NEVIDITEĽNÝ OBAL PRE TEXT --- */}
      {/* Box je preč! Zostal len text s jemným bielym tieňom pre lepšiu čitateľnosť */}
      <div className="relative z-10 max-w-2xl w-full text-center p-4 flex flex-col items-center">
        
        <h1 className="text-6xl md:text-7xl font-extrabold text-sky-900 mb-6 tracking-tight drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
          <span className="text-green-600">Safe</span>Story.eu
        </h1>
        
        <p className="text-2xl text-slate-800 mb-10 leading-relaxed font-bold drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] max-w-lg">
          Vitajte vo svete bezpečných dobrodružstiev! Sofia a Olívia sú pripravené. 
          Aktuálne máme v databáze pripravených <strong className="text-sky-700">{scenarios.length} testovacích scenárov</strong>.
        </p>
        
        <Link href="/play" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-12 rounded-full text-2xl transition-all shadow-[0_8px_30px_rgb(14,165,233,0.4)] hover:shadow-[0_8px_30px_rgb(14,165,233,0.6)] transform hover:-translate-y-1">
  Začať hrať
</Link>
      </div>

    </main>
  );
}