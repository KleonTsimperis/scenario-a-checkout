'use client';

import React, { useState, useEffect } from 'react';
import { useCartSync } from '@/hooks/useCartSync';

interface TicketMeta {
  id: string;
  title: string;
  severity: string;
}

export function CandidateTaskHUD() {
  const [isOpen, setIsOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 minutes
  const { syncQuantityChange } = useCartSync();

  // Jira Ticket Status
  const [ticketStatus, setTicketStatus] = useState<Record<string, 'IN_PROGRESS' | 'DONE'>>({
    'BUG-1042': 'IN_PROGRESS',
    'BUG-1043': 'IN_PROGRESS',
  });

  // Modal State
  const [activeModalTicket, setActiveModalTicket] = useState<TicketMeta | null>(null);
  const [rootCause, setRootCause] = useState('');
  const [keyChanges, setKeyChanges] = useState('');
  const [qaSteps, setQaSteps] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Countdown timer stored in sessionStorage
  useEffect(() => {
    const storedStart = sessionStorage.getItem('assessment_start_time');
    let startTime = storedStart ? parseInt(storedStart, 10) : Date.now();
    if (!storedStart) {
      sessionStorage.setItem('assessment_start_time', String(startTime));
    }

    const storedStatus = sessionStorage.getItem('assessment_ticket_status');
    if (storedStatus) {
      try {
        setTicketStatus(JSON.parse(storedStatus));
      } catch {
        // ignore
      }
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

  const handleOpenTransitionModal = (ticket: TicketMeta) => {
    setActiveModalTicket(ticket);
    setRootCause('');
    setKeyChanges('');
    setQaSteps('');
    setFormError('');
  };

  const handleSubmitJiraTransition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootCause.trim() || !keyChanges.trim() || !qaSteps.trim()) {
      setFormError('All 3 bullet points are required before transitioning to DONE.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const res = await fetch('/api/assessment/transition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: activeModalTicket?.id,
          ticketTitle: activeModalTicket?.title,
          rootCause,
          keyChanges,
          qaSteps,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save resolution notes.');
      }

      const updated = {
        ...ticketStatus,
        [activeModalTicket!.id]: 'DONE' as const,
      };
      setTicketStatus(updated);
      sessionStorage.setItem('assessment_ticket_status', JSON.stringify(updated));

      setSuccessToast(`Ticket ${activeModalTicket?.id} marked DONE & saved to PROMPTS.md!`);
      setActiveModalTicket(null);
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: any) {
      setFormError(err.message || 'Error saving ticket transition.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-2xl font-medium text-xs flex items-center space-x-2 border border-green-400 animate-in fade-in slide-in-from-top-3">
          <span>✓</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Collapsed HUD Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-40 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-2xl font-medium text-sm flex items-center space-x-2 border-2 border-white/20 transition-all"
        >
          <span>🛠 Candidate Tasks Console</span>
          <span className="bg-indigo-900/60 text-xs px-2 py-0.5 rounded-full font-mono">
            {formatTime(timeLeft)}
          </span>
        </button>
      )}

      {/* Main Floating Console */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-40 w-96 bg-gray-900 text-gray-100 rounded-xl shadow-2xl border border-gray-700 p-5 font-sans animate-in slide-in-from-bottom-5">
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
            {/* Ticket 1: BUG-1042 */}
            <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-yellow-400">[BUG-1042] Race Condition</span>
                  {ticketStatus['BUG-1042'] === 'DONE' ? (
                    <span className="px-1.5 py-0.5 bg-green-900/80 text-green-300 border border-green-600 rounded text-[10px] font-bold">
                      ✓ DONE
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-yellow-900/60 text-yellow-300 border border-yellow-700 rounded text-[10px]">
                      IN PROGRESS
                    </span>
                  )}
                </div>
                <span className="text-gray-400">High</span>
              </div>
              <p className="mt-1 text-gray-300">
                Fast quantity clicks revert when network responses resolve out-of-order.
              </p>

              <div className="mt-2.5 space-y-1.5">
                <button
                  onClick={handleSimulateRaceCondition}
                  className="w-full bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-200 border border-yellow-500/40 py-1 px-2 rounded font-medium transition-colors text-center"
                >
                  ⚡ Trigger Rapid 3x Clicks (Reproduce Bug)
                </button>
                <button
                  onClick={() =>
                    handleOpenTransitionModal({
                      id: 'BUG-1042',
                      title: 'Shopping cart quantity flickers and reverts',
                      severity: 'High',
                    })
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2 rounded font-medium transition-colors text-center shadow-sm"
                >
                  {ticketStatus['BUG-1042'] === 'DONE' ? '✏️ Edit Jira Notes' : '🎫 Transition Ticket -> DONE'}
                </button>
              </div>
            </div>

            {/* Ticket 2: BUG-1043 */}
            <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-red-400">[BUG-1043] Hydration Mismatch</span>
                  {ticketStatus['BUG-1043'] === 'DONE' ? (
                    <span className="px-1.5 py-0.5 bg-green-900/80 text-green-300 border border-green-600 rounded text-[10px] font-bold">
                      ✓ DONE
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-yellow-900/60 text-yellow-300 border border-yellow-700 rounded text-[10px]">
                      IN PROGRESS
                    </span>
                  )}
                </div>
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

              <button
                onClick={() =>
                  handleOpenTransitionModal({
                    id: 'BUG-1043',
                    title: 'Sentry Alert: React Hydration Mismatch in CartDrawer',
                    severity: 'Critical',
                  })
                }
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2 rounded font-medium transition-colors text-center shadow-sm"
              >
                {ticketStatus['BUG-1043'] === 'DONE' ? '✏️ Edit Jira Notes' : '🎫 Transition Ticket -> DONE'}
              </button>
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
      )}

      {/* Realistic Jira Transition Modal */}
      {activeModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-sans animate-in fade-in">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden text-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-800/50">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-900 text-blue-200 border border-blue-700">
                  Jira Sprint
                </span>
                <h3 className="font-bold text-base text-white">
                  Transition {activeModalTicket.id} → <span className="text-green-400">DONE</span>
                </h3>
              </div>
              <button
                onClick={() => setActiveModalTicket(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitJiraTransition} className="p-6 space-y-4">
              <div className="text-xs text-gray-300 bg-gray-800/40 p-3 rounded border border-gray-700/50">
                <p className="font-semibold text-white">{activeModalTicket.title}</p>
                <p className="mt-1 text-gray-400">
                  To transition this ticket to <strong>DONE</strong>, provide 3 structured resolution bullet points. These notes are automatically appended to your <code>PROMPTS.md</code> submission file.
                </p>
              </div>

              {formError && (
                <div className="p-2.5 rounded bg-red-900/50 border border-red-700 text-red-200 text-xs">
                  {formError}
                </div>
              )}

              {/* Bullet Point 1 */}
              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">
                  1. Root Cause Analysis (What specifically broke?) *
                </label>
                <textarea
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  placeholder="e.g., In-flight requests completed out-of-order, causing stale responses to overwrite newer optimistic mutations..."
                  rows={2}
                  className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Bullet Point 2 */}
              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">
                  2. Key Changes & Architectural Decisions (Why this approach over debounce/hacks?) *
                </label>
                <textarea
                  value={keyChanges}
                  onChange={(e) => setKeyChanges(e.target.value)}
                  placeholder="e.g., Added monotonic mutation sequence IDs to validate incoming responses rather than disabling buttons or debouncing..."
                  rows={2}
                  className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Bullet Point 3 */}
              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">
                  3. QA Verification & Testing Instructions *
                </label>
                <textarea
                  value={qaSteps}
                  onChange={(e) => setQaSteps(e.target.value)}
                  placeholder="e.g., Throttled network to Slow 3G. Rapidly tapped + 4 times. Verified final count matched 4 and unit tests pass..."
                  rows={2}
                  className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setActiveModalTicket(null)}
                  className="px-4 py-2 rounded text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded text-xs font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Saving...' : '✓ Submit & Mark DONE'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
