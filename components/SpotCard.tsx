'use client';

import { useState } from 'react';
import { SpotWithReports } from '@/types';
import { timeAgo } from '@/lib/relativeTime';
import { ReportModal } from './ReportModal';

interface SpotCardProps {
  spot: SpotWithReports;
  onReportSubmitted: () => void;
}

export function SpotCard({ spot, onReportSubmitted }: SpotCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);

  const isFree = spot.status === 'free';
  const statusColor = isFree ? 'bg-green-600' : 'bg-red-600';
  const statusLabel = isFree ? 'Free' : 'Taken';

  return (
    <>
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl overflow-hidden border border-slate-600 hover:border-slate-500 transition p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-white font-semibold text-sm truncate">{spot.street_name}</p>
            <p className="text-slate-400 text-xs">{spot.neighborhood}</p>
          </div>
          <div className={`${statusColor} rounded px-2 py-1 text-white text-xs font-semibold ml-2 shrink-0`}>
            {statusLabel}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span>{spot.recent_reports} {spot.recent_reports === 1 ? 'report' : 'reports'}</span>
          <span className="text-slate-500">{timeAgo(spot.last_report_time)}</span>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium text-sm transition"
        >
          Report Status
        </button>
      </div>

      <ReportModal
        spot={spot}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={() => {
          setShowReportModal(false);
          onReportSubmitted();
        }}
      />
    </>
  );
}
