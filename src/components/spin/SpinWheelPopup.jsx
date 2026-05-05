'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { spinOnce } from '@/lib/spin-api';
import { useAuth } from '@/context/AuthContext';
import { useSpin } from '@/context/SpinContext';

const STORAGE_KEY = process.env.NEXT_PUBLIC_SPIN_WHEEL_STORAGE_KEY || 'magic-tissue-spin-popup-v1';
const REAPPEAR_INTERVAL_MS = 30_000;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createConfetti() {
  return Array.from({ length: 18 }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 1.4 + Math.random() * 1.2,
    color: ['#fb7185', '#f59e0b', '#facc15', '#34d399', '#60a5fa'][index % 5],
  }));
}

function playSpinTone() {
  if (typeof window === 'undefined' || !window.AudioContext) {
    return;
  }

  const context = new window.AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(240, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(620, context.currentTime + 0.6);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.7);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.72);
}

export default function SpinWheelPopup() {
  const { token, isAuthReady } = useAuth();
  const { config, status, setStatus } = useSpin();
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const confetti = useMemo(() => createConfetti(), []);

  const options = useMemo(() => config?.options || [], [config?.options]);
  const segmentSize = options.length > 0 ? 360 / options.length : 360;

  const wheelBackground = useMemo(() => {
    if (options.length === 0) {
      return 'conic-gradient(#881337 0deg 360deg)';
    }

    return `conic-gradient(${options
      .map((option, index) => {
        const start = index * segmentSize;
        const end = start + segmentSize;
        return `${option.color || ['#be123c', '#ea580c', '#f59e0b', '#1f2937'][index % 4]} ${start}deg ${end}deg`;
      })
      .join(', ')})`;
  }, [options, segmentSize]);

  useEffect(() => {
    if (!config?.popupEnabled || status.hasSpun || !isAuthReady) {
      return undefined;
    }

    if (typeof window === 'undefined') {
      return undefined;
    }

    const showPopup = () => {
      if (Math.random() > Number(config.showProbability ?? 0.5)) {
        return;
      }

      setIsOpen(true);
    };

    const delay = randomBetween(Number(config.minDelaySeconds || 5), Number(config.maxDelaySeconds || 20)) * 1000;
    timeoutRef.current = window.setTimeout(showPopup, delay);
    intervalRef.current = window.setInterval(() => {
      if (!isOpen && !isSpinning && !result) {
        showPopup();
      }
    }, REAPPEAR_INTERVAL_MS);

    function onExitIntent(event) {
      if (event.clientY > 24 || !config.exitIntentEnabled) {
        return;
      }

      if (!isOpen && !isSpinning && !result) {
        setIsOpen(true);
      }
    }

    window.addEventListener('mouseout', onExitIntent);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      window.removeEventListener('mouseout', onExitIntent);
    };
  }, [config, isAuthReady, isOpen, isSpinning, result, status.hasSpun]);

  async function handleSpin() {
    if (!token || isSpinning || options.length === 0) {
      return;
    }

    setIsSpinning(true);
    setError('');
    playSpinTone();

    try {
      const data = await spinOnce(token);
      const reward = data.reward;
      const optionIndex = Math.max(0, options.findIndex((option) => option.id === reward.id));
      const landingAngle = optionIndex * segmentSize + segmentSize / 2;
      const nextRotation = 360 * 6 + (360 - landingAngle);

      setRotation((prev) => prev + nextRotation);
      setResult(reward);

      window.setTimeout(() => {
        setStatus({
          hasSpun: true,
          used: false,
          reward: {
            label: reward.label,
            type: reward.type,
            value: reward.value,
          },
        });
        setIsOpen(false);
        const orderSection = document.getElementById('order-form');
        if (orderSection) {
          orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 3600);
    } catch (spinError) {
      if (spinError.message === 'Spin already used') {
        setStatus((prev) => ({ ...prev, hasSpun: true }));
      }
      setError(spinError.message || 'Spin failed');
    } finally {
      window.setTimeout(() => {
        setIsSpinning(false);
      }, 3600);
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="relative grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[#0f0b11] shadow-[0_40px_100px_rgba(0,0,0,0.45)] lg:grid-cols-[0.95fr_1.05fr]"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/70"
            >
              Close
            </button>

            {/* Added hidden lg:block here to hide this left section on mobile devices */}
            <div className="hidden lg:block relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,#fb718533,transparent_50%),linear-gradient(180deg,#1a0d12,#0b090d)] p-8 lg:border-b-0 lg:border-r">
              {config?.sideImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={config.sideImageUrl} alt="Spin reward" className="absolute inset-0 h-full w-full object-cover opacity-30" />
              ) : null}
              <div className="relative z-10">
                <span className="inline-flex rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-rose-300">
                  Surprise Reward
                </span>
                <h2 className="mt-6 max-w-md text-3xl font-black leading-tight text-white md:text-5xl">
                  {config?.popupTitle || 'Spin the wheel for a surprise discount'}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/70 md:text-base">
                  {config?.popupSubtitle || 'Try your luck once and unlock a verified reward for checkout.'}
                </p>
                <div className="mt-4 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-amber-200">
                  Every 30s a new chance appears
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {options.slice(0, 4).map((option) => (
                    <div key={option.id} className="rounded-[22px] border border-white/10 bg-black/30 px-4 py-3">
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Reward</div>
                      <div className="mt-2 text-lg font-bold text-white">{option.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#f59e0b22,transparent_45%),linear-gradient(180deg,#120f16,#09080c)] px-6 py-10">
              <div className="absolute top-10 h-6 w-6 rotate-45 border-l-[18px] border-r-[18px] border-t-[28px] border-l-transparent border-r-transparent border-t-rose-500" />

              <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full border border-white/10 bg-black/20 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <motion.div
                  animate={{ rotate: rotation }}
                  transition={{ duration: 3.6, ease: [0.15, 0.8, 0.2, 1] }}
                  style={{ background: wheelBackground }}
                  className="relative h-full w-full rounded-full border-[10px] border-[#f4d7a1] shadow-[inset_0_0_30px_rgba(255,255,255,0.15)]"
                >
                  {options.map((option, index) => (
                    <div
                      key={option.id}
                      className="absolute left-1/2 top-1/2 origin-top-left"
                      style={{
                        transform: `rotate(${index * segmentSize}deg) translateY(-48%)`,
                      }}
                    >
                      <div
                        className="flex w-[132px] -translate-x-1/2 -translate-y-[132px] justify-center text-center text-[11px] font-black uppercase tracking-[0.14em] text-white"
                        style={{ transform: `rotate(${segmentSize / 2}deg)` }}
                      >
                        {option.label}
                      </div>
                    </div>
                  ))}
                </motion.div>

                <div className="absolute flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-[#f4d7a1] bg-[#1a1015] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                  <span className="text-sm font-black uppercase tracking-[0.22em] text-amber-100">Luck</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSpin}
                disabled={!token || isSpinning}
                className="mt-8 rounded-full bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-400 px-12 py-4 text-sm font-black uppercase tracking-[0.25em] text-white shadow-[0_20px_45px_rgba(244,63,94,0.4)] transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSpinning ? 'Spinning...' : config?.popupButtonText || 'Spin Now'}
              </button>

              {result ? (
                <div className="mt-6 rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-center">
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200/70">You Won</div>
                  <div className="mt-2 text-2xl font-black text-white">{result.label}</div>
                </div>
              ) : null}

              {error ? <p className="mt-5 text-sm text-rose-300">{error}</p> : null}

              {result && result.type !== 'none'
                ? confetti.map((piece) => (
                    <motion.span
                      key={piece.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: [0, 1, 0], y: [0, 220], x: [0, (piece.id % 2 === 0 ? 1 : -1) * 80] }}
                      transition={{ duration: piece.duration, delay: piece.delay }}
                      className="absolute top-12 h-3 w-3 rounded-sm"
                      style={{ left: `${piece.left}%`, backgroundColor: piece.color }}
                    />
                  ))
                : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}