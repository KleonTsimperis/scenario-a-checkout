'use client';

import React, { useState, useEffect } from 'react';
import { useCartSync } from '@/hooks/useCartSync';

export function CandidateTaskHUD() {
  const [isOpen, setIsOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 minutes
  const { syncQuantityChange } = useCartSync();

  // Simple countdown timer stored in sessionStorage
  useEffect(() => {
    const storedStart = sessionStorage.getItem('assessment_start_time');
    let startTime = storedStart ? parseInt(storedStart, 10) : Date.now();
    if (!storedStart) {
      sessionStorage.setItem('assessment_start_time', String(startTime));
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 3600 - elapsed);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleSimulateRaceCondition = async () => {
    // Rapidly trigger 3 mutations on item-1
    syncQuantityChange('item-1', 1);
    await new Promise((r) => setTimeout(r, 60));
    syncQuantityChange('item-1', 1);
    await new Promise((r) => setTimeout(r, 60));
    syncQuantityChange('item-1', 1);
  };

  const handleSetUSD = () => {
    localStorage.setItem('user_currency', 'USD');
    window.location.reload();
  };

  const handleResetEUR = () => {
    localStorage.removeItem('user_currency');
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-2xl font-medium text-sm flex items-center space-x-2 border-2 border-white/20 transition-all"
      >
        <span>🛠 Candidate Tasks Console</span>
        <span className="bg-indigo-900/60 text-xs px-2 py-0.5 rounded-full font-mono">
          {formatTime(timeLeft)}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-gray-900 text-gray-100 rounded-xl shadow-2xl border border-gray-700 p-5 font-sans animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <h3 className="font-bold text-sm text-white">Candidate Tasks Console</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono bg-gray-800 px-2 py-0.5 rounded text-indigo-300 border border-gray-700">
            ⏱ {formatTime(timeLeft)}
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-xs font-semibold px-1.5 py-0.5 rounded hover:bg-gray-800"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Task Checklist & Reproduction Triggers */}
      <div className="mt-4 space-y-4 text-xs">
        {/* Ticket 1 */}
        <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/60">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-yellow-400">[BUG-1042] Race Condition</span>
            <span className="text-gray-400">High</span>
          </div>
          <p className="mt-1 text-gray-300">
            Fast quantity clicks revert when network responses resolve out-of-order.
          </p>
          <button
            onClick={handleSimulateRaceCondition}
            className="mt-2 w-full bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-200 border border-yellow-500/40 py-1.5 px-2 rounded font-medium transition-colors text-center"
          >
            ⚡ Trigger Rapid 3x Clicks (Reproduce Bug)
          </button>
        </div>

        {/* Ticket 2 */}
        <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/60">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-red-400">[BUG-1043] Hydration Mismatch</span>
            <span className="text-gray-400">Critical</span>
          </div>
          <p className="mt-1 text-gray-300">
            Storing currency in localStorage breaks Next.js initial SSR render.
          </p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleSetUSD}
              className="flex-1 bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 py-1 px-2 rounded font-medium transition-colors"
            >
              Set USD & Reload
            </button>
            <button
              onClick={handleResetEUR}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-2 rounded font-medium transition-colors"
            >
              Reset EUR
            </button>
          </div>
        </div>

        {/* Reminders */}
        <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400 space-y-1">
          <p>📌 Full details: <code className="text-indigo-300">./TASKS.md</code></p>
          <p>🧪 Run tests: <code className="text-indigo-300">pnpm test</code></p>
          <p>📝 Document prompts: <code className="text-indigo-300">./PROMPTS.md</code></p>
          <p className="text-amber-300/80">⚠️ Do not disable buttons or modify files in __tests__/</p>
        </div>
      </div>
    </div>
  );
}
