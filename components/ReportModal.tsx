'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SpotWithReports } from '@/types';

interface ReportModalProps {
  spot: SpotWithReports;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function ReportModal({ spot, isOpen, onClose, onSubmit }: ReportModalProps) {
  const [status, setStatus] = useState<'free' | 'taken'>('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const [error, setError] = useState('');

  if (!isOpen || !mounted) return null;

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spot_id: spot.id,
          status,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-2">Report Parking Status</h2>
        <p className="text-slate-400 text-sm mb-4">{spot.street_name}</p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => setStatus('free')}
            className={`w-full p-3 rounded-lg font-semibold transition ${
              status === 'free'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setStatus('taken')}
            className={`w-full p-3 rounded-lg font-semibold transition ${
              status === 'taken'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Taken
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
