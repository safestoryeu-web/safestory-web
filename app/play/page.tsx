"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import scenariosSk from '../../data/scenarios.json';
import scenariosEn from '../../data/scenarios.en.json';
import { useLanguage } from '../LanguageContext';

type Scenario = (typeof scenariosSk)[number];

const playUI = {
  sk: {
    theme: "Téma",
    scenario: "Scenár",
    of: "z",
    nextScenario: "Ďalší scenár ➡️",
    showResult: "Ukázať výsledok! 🏁",
    playAgain: "Hrať ešte raz 🔄",
    backHome: "Návrat domov",
    aboutLink: "O projekte SafeStory a Podpora",
    feedbackCorrect: "Skvelé, správne rozhodnutie! 🎉",
    feedbackWrong: "Pozor, toto nie je bezpečné! 🛑",
    finalTitleSuccess: "Úžasná práca!",
    finalTitleTryAgain: "Nevadí, nabudúce to bude lepšie!",
    finalParaSuccess: "Sofia a Olívia sú na teba hrdé. Dokázal si vyriešiť",
    finalParaSuccess2: "dôležitých situácií a vieš, ako sa zachovať bezpečne!",
    finalParaTryAgain: "Nevadí, tento raz sa ti podarilo vyriešiť",
    finalParaTryAgain2: "situácií. Ak si hru zahráš znova, naučíš sa, ako sa zachovať bezpečne a nabudúce to pôjde ešte lepšie!",
    ariaStopScenario: "Zastaviť čítanie scenára",
    ariaPlayScenario: "Prehrať scenár nahlas",
    ariaStopOption: "Zastaviť čítanie odpovede",
    ariaPlayOption: "Prehrať odpoveď nahlas",
    ariaStopFeedback: "Zastaviť čítanie vysvetlenia",
    ariaPlayFeedback: "Prehrať vysvetlenie nahlas",
    ariaStopFinal: "Zastaviť čítanie hodnotenia",
    ariaPlayFinal: "Prehrať hodnotenie nahlas",
    altCongratulations: "Gratulujeme!",
    altTryAgain: "Skús to znova",
  },
  en: {
    theme: "Theme",
    scenario: "Scenario",
    of: "of",
    nextScenario: "Next scenario ➡️",
    showResult: "Show result! 🏁",
    playAgain: "Play again 🔄",
    backHome: "Back home",
    aboutLink: "About SafeStory & Support",
    feedbackCorrect: "Great, the right choice! 🎉",
    feedbackWrong: "Watch out, that's not safe! 🛑",
    finalTitleSuccess: "Amazing job!",
    finalTitleTryAgain: "No worries, next time will be better!",
    finalParaSuccess: "Sofia and Olivia are proud of you. You solved",
    finalParaSuccess2: "important situations and know how to stay safe!",
    finalParaTryAgain: "No worries, this time you solved",
    finalParaTryAgain2: "situations. If you play again, you'll learn how to stay safe and do even better next time!",
    ariaStopScenario: "Stop reading scenario",
    ariaPlayScenario: "Play scenario aloud",
    ariaStopOption: "Stop reading answer",
    ariaPlayOption: "Play answer aloud",
    ariaStopFeedback: "Stop reading explanation",
    ariaPlayFeedback: "Play explanation aloud",
    ariaStopFinal: "Stop reading summary",
    ariaPlayFinal: "Play summary aloud",
    altCongratulations: "Congratulations!",
    altTryAgain: "Try again",
  },
} as const;

export default function PlayPage() {
  const { language } = useLanguage();
  const scenarios: Scenario[] = language === "en" ? (scenariosEn as Scenario[]) : (scenariosSk as Scenario[]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSource, setSpeakingSource] = useState<'scenario' | 'option' | 'feedback' | 'final' | null>(null);
  const [speakingOptionIndex, setSpeakingOptionIndex] = useState<number | null>(null);
  const [scenarioOrder, setScenarioOrder] = useState<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const t = playUI[language];
  const totalScenarios = scenarios.length;
  const effectiveIndex =
    scenarioOrder.length > 0 && currentIndex < scenarioOrder.length
      ? scenarioOrder[currentIndex]
      : currentIndex;
  const currentScenario = scenarios[effectiveIndex];
  const isSuccess = correctCount > totalScenarios / 2;

  // Inicializácia Speech Synthesis a zoznamu hlasov
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    setSpeechSupported(true);

    const loadVoices = () => {
      const loadedVoices = synth.getVoices();
      if (loadedVoices.length > 0) {
        setVoices(loadedVoices);
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
      synth.cancel();
    };
  }, []);

  // Náhodné poradie scenárov podľa zvoleného jazyka
  useEffect(() => {
    const indices = scenarios.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setScenarioOrder(indices);
  }, [language]);

  // Pri zmene scenára zrušíme prípadné prebiehajúce čítanie
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingSource(null);
    setSpeakingOptionIndex(null);
  }, [currentIndex]);

  const playTone = (frequency: number, duration: number, type: OscillatorType = "sine", startTimeOffset = 0) => {
    if (typeof window === "undefined") return;

    const AudioContextClass =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new AudioContextClass();
    }

    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startTimeOffset);

    gainNode.gain.setValueAtTime(0.18, ctx.currentTime + startTimeOffset);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + startTimeOffset + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime + startTimeOffset);
    oscillator.stop(ctx.currentTime + startTimeOffset + duration);
  };

  const playCorrectSound = () => {
    // Jemné "cink" – krátky vyšší tón
    playTone(1200, 0.18, "triangle");
  };

  const playWrongSound = () => {
    // Jemné "tudu" – dva krátke klesajúce tóny
    playTone(500, 0.16, "square");
    playTone(350, 0.18, "square", 0.16);
  };

  const getPreferredVoice = (lang: 'sk' | 'en') => {
    if (!voices.length) return undefined;

    const name = (v: SpeechSynthesisVoice) => (v.name || '').toLowerCase();
    const voiceLang = (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase();
    const soundsFemale = (v: SpeechSynthesisVoice) => {
      const n = name(v);
      return n.includes('female') || n.includes('woman') || n.includes('zuzana') || n.includes('eva') || n.includes('jana');
    };

    if (lang === 'en') {
      // Pre angličtinu: preferujeme anglický hlas (en-GB, en-US), ideálne ženský
      const enVoices = voices.filter((v) => voiceLang(v).startsWith('en'));
      const enFemale = enVoices.filter((v) => soundsFemale(v));
      return enFemale[0] || enVoices[0] || voices.find((v) => voiceLang(v).startsWith('en')) || voices[0];
    }

    // Pre slovenčinu: preferujeme SK/CZ alebo ženské meno
    const preferredVoices = voices.filter((voice) => {
      const langCode = voiceLang(voice);
      const isSkOrCz = langCode.startsWith('sk') || langCode.startsWith('cs');
      return isSkOrCz || soundsFemale(voice);
    });
    return preferredVoices[0] || voices[0];
  };

  const getUtteranceLang = () => (language === 'en' ? 'en-GB' : 'sk-SK');

  const speakCurrentScenario = () => {
    if (!speechSupported || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `${currentScenario.title}. ${currentScenario.text}`
    );
    utterance.lang = getUtteranceLang();
    const voiceToUse = getPreferredVoice(language);
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.rate = 0.98;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingSource('scenario');
      setSpeakingOptionIndex(null);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    };

    synth.speak(utterance);
  };

  const speakOption = (index: number, text: string) => {
    if (!speechSupported || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getUtteranceLang();
    const voiceToUse = getPreferredVoice(language);
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.rate = 1;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingSource('option');
      setSpeakingOptionIndex(index);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    };

    synth.speak(utterance);
  };

  const speakFeedback = (text: string) => {
    if (!speechSupported || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getUtteranceLang();
    const voiceToUse = getPreferredVoice(language);
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.rate = 1;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingSource('feedback');
      setSpeakingOptionIndex(null);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    };

    synth.speak(utterance);
  };

  const handleToggleSpeak = () => {
    if (!speechSupported || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    if (isSpeaking && speakingSource === 'scenario') {
      synth.cancel();
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    } else {
      speakCurrentScenario();
    }
  };

  const handleToggleOptionSpeak = (index: number, text: string) => {
    if (!speechSupported || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    if (isSpeaking && speakingSource === 'option' && speakingOptionIndex === index) {
      synth.cancel();
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    } else {
      speakOption(index, text);
    }
  };

  const handleToggleFeedbackSpeak = (text: string) => {
    if (!speechSupported || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    if (isSpeaking && speakingSource === 'feedback') {
      synth.cancel();
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    } else {
      speakFeedback(text);
    }
  };

  const speakFinalSummary = () => {
    if (!speechSupported || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const successText = language === "en"
      ? `Amazing job! You solved ${correctCount} out of ${totalScenarios} important situations and now you know how to stay safe.`
      : `Úžasná práca! Dokázal si vyriešiť ${correctCount} z ${totalScenarios} dôležitých situácií a teraz vieš, ako sa zachovať bezpečne.`;
    const tryAgainText = language === "en"
      ? `No worries, next time will be better. You solved ${correctCount} out of ${totalScenarios} situations. Try again and you'll learn how to stay safe.`
      : `Nevadí, nabudúce to bude lepšie. Teraz si vyriešil ${correctCount} z ${totalScenarios} situácií. Skús to ešte raz a naučíš sa, ako sa zachovať bezpečne.`;

    const summaryText = isSuccess ? successText : tryAgainText;

    const utterance = new SpeechSynthesisUtterance(summaryText);
    utterance.lang = getUtteranceLang();
    const voiceToUse = getPreferredVoice(language);
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.rate = 0.98;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingSource('final');
      setSpeakingOptionIndex(null);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    };

    synth.speak(utterance);
  };

  const handleToggleFinalSpeak = () => {
    if (!speechSupported || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    if (isSpeaking && speakingSource === 'final') {
      synth.cancel();
      setIsSpeaking(false);
      setSpeakingSource(null);
      setSpeakingOptionIndex(null);
    } else {
      speakFinalSummary();
    }
  };

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;

    const option = currentScenario.options[index];
    if (option) {
      if (option.isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    }

    setSelectedOption(index);
    setShowFeedback(true);
  };

  const handleNextScenario = () => {
    // Pri prechode ďalej si zapamätáme, či bola aktuálna odpoveď správna
    if (
      selectedOption !== null &&
      currentScenario.options[selectedOption] &&
      currentScenario.options[selectedOption].isCorrect
    ) {
      setCorrectCount((prev) => prev + 1);
    }

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
    setCorrectCount(0);

    // Vygenerujeme nové náhodné poradie scenárov
    const indices = scenarios.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setScenarioOrder(indices);
  };

  // Bezpečnostná poistka – ak by sa z nejakého dôvodu nenašiel scenár (napr. po hot-reloade),
  // nerenderujeme nič a vyhneme sa pádu aplikácie.
  if (!currentScenario) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[url('/images/background.webp')] bg-cover bg-center bg-fixed flex flex-col items-center justify-center py-8 px-4 font-sans text-slate-900">
      
      <div className="max-w-5xl w-full bg-green-50/85 backdrop-blur-md rounded-[2rem] shadow-2xl overflow-hidden border-2 border-white/60 flex flex-col md:flex-row relative min-h-[600px]">
        
        {/* Ak hra skončila, ukážeme Víťaznú obrazovku */}
        {isFinished ? (
          <div className="w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">
            {/* Ľavá strana: Oslavný / povzbudzujúci obrázok */}
            <div className="relative w-full h-80 md:w-1/2 md:h-auto">
              <Image 
                src={isSuccess ? "/images/scenarios/victory_celebration.webp" : "/images/scenarios/try_again.webp"} 
                alt={isSuccess ? t.altCongratulations : t.altTryAgain}
                fill
                className="object-cover"
              />
            </div>
            {/* Pravá strana: Text s gratuláciou a hodnotením */}
            <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-center items-center text-center">
              <div className="text-6xl mb-4">{isSuccess ? "🏆" : "💪"}</div>

              {/* Hviezdičky za správne odpovede */}
              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: totalScenarios }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl md:text-3xl ${
                      i < correctCount ? 'text-yellow-400' : 'text-slate-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-teal-700">
                  {isSuccess ? t.finalTitleSuccess : t.finalTitleTryAgain}
                </h1>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleToggleFinalSpeak}
                    className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-teal-500 bg-white/70 text-teal-700 flex items-center justify-center shadow-sm hover:bg-teal-500 hover:text-white transition-colors"
                    aria-label={
                      isSpeaking && speakingSource === 'final'
                        ? t.ariaStopFinal
                        : t.ariaPlayFinal
                    }
                  >
                    {isSpeaking && speakingSource === 'final' ? '⏹' : '🔊'}
                  </button>
                )}
              </div>

              <p className="text-xl text-slate-700 mb-8 leading-relaxed font-medium">
                {isSuccess ? (
                  <>
                    {t.finalParaSuccess}{" "}
                    <span className="font-bold text-teal-700">
                      {correctCount} {t.of} {totalScenarios}
                    </span>{" "}
                    {t.finalParaSuccess2}
                  </>
                ) : (
                  <>
                    {t.finalParaTryAgain}{" "}
                    <span className="font-bold text-teal-700">
                      {correctCount} {t.of} {totalScenarios}
                    </span>{" "}
                    {t.finalParaTryAgain2}
                  </>
                )}
              </p>
              <div className="flex flex-col gap-3 w-full items-center">
                <button 
                  onClick={restartGame}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-full text-2xl transition-all shadow-lg transform hover:-translate-y-1"
                >
                  {t.playAgain}
                </button>
                <Link 
                  href="/"
                  className="text-teal-700 hover:text-teal-900 font-bold text-lg mt-2"
                >
                  {t.backHome}
                </Link>
                <Link
                  href="/about"
                  className="text-xs md:text-sm text-slate-600 hover:text-teal-700 underline underline-offset-2 mt-1"
                >
                  {t.aboutLink}
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
                  style={{ objectPosition: '50% 60%' }}
                  priority
                />
              </div>
            </div>

            <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
              <div className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-3 mt-4 md:mt-0">
                {t.theme}: {currentScenario.topic} | {t.scenario} {currentIndex + 1} {t.of} {scenarios.length}
              </div>

              <div className="flex items-start justify-between gap-3 mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                  {currentScenario.title}
                </h1>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleToggleSpeak}
                    className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-teal-500 bg-white/70 text-teal-700 flex items-center justify-center shadow-sm hover:bg-teal-500 hover:text-white transition-colors"
                    aria-label={
                      isSpeaking && speakingSource === 'scenario'
                        ? t.ariaStopScenario
                        : t.ariaPlayScenario
                    }
                  >
                    {isSpeaking && speakingSource === 'scenario' ? '⏹' : '🔊'}
                  </button>
                )}
              </div>
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
                  const isOptionSpeaking =
                    isSpeaking &&
                    speakingSource === 'option' &&
                    speakingOptionIndex === index;
                  return (
                    <div key={index} className="flex items-stretch gap-3">
                      <button 
                        onClick={() => handleOptionClick(index)}
                        disabled={showFeedback}
                        className={`flex-1 text-left p-5 md:p-6 rounded-2xl border-2 transition-all text-lg font-medium shadow-sm ${buttonStyle}`}
                      >
                        {option.text}
                      </button>
                      {speechSupported && !showFeedback && (
                        <button
                          type="button"
                          onClick={() => handleToggleOptionSpeak(index, option.text)}
                          className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-teal-500 bg-white/70 text-teal-700 flex items-center justify-center shadow-sm hover:bg-teal-500 hover:text-white transition-colors"
                          aria-label={
                            isOptionSpeaking
                              ? t.ariaStopOption
                              : t.ariaPlayOption
                          }
                        >
                          {isOptionSpeaking ? '⏹' : '🔊'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {showFeedback && selectedOption !== null && (
                <div className={`mt-8 p-6 rounded-2xl shadow-inner ${currentScenario.options[selectedOption].isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                  <h3 className={`text-2xl font-bold mb-2 ${currentScenario.options[selectedOption].isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {currentScenario.options[selectedOption].isCorrect ? t.feedbackCorrect : t.feedbackWrong}
                  </h3>
                  <p className="text-lg text-slate-700 mb-6 font-medium leading-relaxed">
                    {currentScenario.options[selectedOption].feedback}
                  </p>
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <button 
                      onClick={handleNextScenario}
                      className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block w-full md:w-auto"
                    >
                      {currentIndex < scenarios.length - 1 ? t.nextScenario : t.showResult}
                    </button>
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => handleToggleFeedbackSpeak(currentScenario.options[selectedOption].feedback)}
                        className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full border-2 border-teal-500 bg-white/70 text-teal-700 flex items-center justify-center shadow-sm hover:bg-teal-500 hover:text-white transition-colors"
                        aria-label={
                          isSpeaking && speakingSource === 'feedback'
                            ? t.ariaStopFeedback
                            : t.ariaPlayFeedback
                        }
                      >
                        {isSpeaking && speakingSource === 'feedback' ? '⏹' : '🔊'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}