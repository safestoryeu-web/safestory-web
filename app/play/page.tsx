"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import scenarios from '../../data/scenarios.json';

export default function PlayPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false); // Nový stav pre koniec hry

  const currentScenario = scenarios[currentIndex];

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
  };

  const handleNextScenario = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true); // Ak sme na konci, aktivujeme víťaznú obrazovku
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsFinished(false);
  };

  return (
    <main className="min-h-screen bg-[url('/images/background.webp')] bg-cover bg-center bg-fixed flex flex-col items-center justify-center py-8 px-4 font-sans text-slate-900">
      
      <div className="max-w-5xl w-full bg-green-50/85 backdrop-blur-md rounded-[2rem] shadow-2xl overflow-hidden border-2 border-white/60 flex flex-col md:flex-row relative min-h-[600px]">
        
        {/* Ak hra skončila, ukážeme Víťaznú obrazovku */}
        {isFinished ? (
          <div className="w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">
            {/* Ľavá strana: Oslavný obrázok */}
            <div className="relative w-full h-80 md:w-1/2 md:h-auto">
              <Image 
                src="/images/scenarios/victory_celebration.webp" 
                alt="Gratulujeme!"
                fill
                className="object-cover"
              />
            </div>
            {/* Pravá strana: Text s gratuláciou */}
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-center text-center">
              <div className="text-6xl mb-6">🏆</div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-teal-700 mb-6">
                Úžasná práca!
              </h1>
              <p className="text-xl text-slate-700 mb-10 leading-relaxed font-medium">
                Sofia a Olívia sú na teba hrdé. Dokázal si vyriešiť všetky dôležité situácie a vieš, ako sa zachovať bezpečne. Teraz si skutočný strážca bezpečnosti!
              </p>
              <div className="flex flex-col gap-4 w-full">
                <button 
                  onClick={restartGame}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-full text-2xl transition-all shadow-lg transform hover:-translate-y-1"
                >
                  Hrať ešte raz 🔄
                </button>
                <Link 
                  href="/"
                  className="text-teal-700 hover:text-teal-900 font-bold text-lg mt-4"
                >
                  Návrat domov
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Pôvodný herný kód (zobrazuje sa, kým nie je koniec) */
          <>
            <div className="absolute top-0 left-0 h-2 bg-white/50 w-full z-20">
               <div 
                 className="h-full bg-green-500 transition-all duration-500" 
                 style={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }}
               ></div>
            </div>

            {/* Ľavý blok s obrázkom – výraznejší a vyšší */}
            <div className="w-full md:w-5/12 bg-white/20 overflow-hidden shadow-sm flex">
              {/* Na mobile je obrázok o niečo vyšší, na väčších obrazovkách vypĺňa celú výšku bloku */}
              <div className="relative w-full aspect-[4/5] md:h-full md:aspect-auto">
                <Image
                  src={currentScenario.image}
                  alt={currentScenario.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover md:object-cover"
                  style={{ objectPosition: '50% 75%' }}
                  priority
                />
              </div>
            </div>

            <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
              <div className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-3 mt-4 md:mt-0">
                Téma: {currentScenario.topic} | Scenár {currentIndex + 1} z {scenarios.length}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6">
                {currentScenario.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-700 mb-10 leading-relaxed font-medium">
                {currentScenario.text}
              </p>

              <div className="flex flex-col gap-4">
                {currentScenario.options.map((option, index) => {
                  let buttonStyle = "border-white bg-white/60 hover:border-teal-400 hover:bg-white text-slate-700 backdrop-blur-sm"; 
                  if (showFeedback) {
                    if (option.isCorrect) buttonStyle = "border-green-500 bg-green-100 text-green-800";
                    else if (selectedOption === index) buttonStyle = "border-red-500 bg-red-100 text-red-800";
                    else buttonStyle = "border-white/50 bg-white/30 text-slate-500 opacity-50";
                  }
                  return (
                    <button 
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      disabled={showFeedback}
                      className={`w-full text-left p-5 md:p-6 rounded-2xl border-2 transition-all text-lg font-medium shadow-sm ${buttonStyle}`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {showFeedback && selectedOption !== null && (
                <div className={`mt-8 p-6 rounded-2xl shadow-inner ${currentScenario.options[selectedOption].isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${currentScenario.options[selectedOption].isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {currentScenario.options[selectedOption].isCorrect ? 'Skvelé, správne rozhodnutie! 🎉' : 'Pozor, toto nie je bezpečné! 🛑'}
                  </h3>
                  <p className="text-lg text-slate-700 mb-6 font-medium leading-relaxed">
                    {currentScenario.options[selectedOption].feedback}
                  </p>
                  <button 
                    onClick={handleNextScenario}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block w-full md:w-auto"
                  >
                    {currentIndex < scenarios.length - 1 ? 'Ďalší scenár ➡️' : 'Ukázať výsledok! 🏁'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}