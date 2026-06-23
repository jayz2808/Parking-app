'use client';

import { ParkingSpot, DIFFICULTY_META, PARKING_TYPE_LABEL } from '@/types';
import { openDirections } from '@/lib/directions';

interface SpotCardProps {
  spot: ParkingSpot;
  onShare: (spot: ParkingSpot) => void;
  shareLabel?: string;
}

export function SpotCard({ spot, onShare, shareLabel }: SpotCardProps) {
  const diff = DIFFICULTY_META[spot.difficulty] ?? DIFFICULTY_META.moderate;

  return (
    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl overflow-hidden border border-slate-600 hover:border-slate-500 transition p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{spot.street_name}</p>
          <p className="text-slate-400 text-xs">{spot.neighborhood}</p>
        </div>
        <div className={`${diff.chip} rounded px-2 py-1 text-white text-xs font-semibold ml-2 shrink-0`}>
          {diff.label}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="bg-slate-600/60 text-slate-200 text-xs px-2 py-0.5 rounded">
          {PARKING_TYPE_LABEL[spot.parking_type] ?? 'Free'}
        </span>
        {spot.best_times && (
          <span className="bg-slate-600/60 text-slate-200 text-xs px-2 py-0.5 rounded">
            Best: {spot.best_times}
          </span>
        )}
      </div>

      {spot.notes && (
        <p className="text-slate-300 text-xs mb-3 leading-relaxed">{spot.notes}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDirections(spot.latitude, spot.longitude);
          }}
          className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-3 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
          Directions
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare(spot);
          }}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg font-medium text-sm transition"
        >
          {shareLabel || 'Share'}
        </button>
      </div>
    </div>
  );
}
