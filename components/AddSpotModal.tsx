'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { City, Difficulty, ParkingType, DIFFICULTY_META, PARKING_TYPE_LABEL } from '@/types';

interface AddSpotModalProps {
  city: City;
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'moderate', 'hard'];
const PARKING_TYPES: ParkingType[] = ['free', 'metered', 'permit', 'mixed'];

export function AddSpotModal({ city, isOpen, onClose, onAdded }: AddSpotModalProps) {
  const [mounted, setMounted] = useState(false);
  const [streetName, setStreetName] = useState('');
  const [neighborhood, setNeighborhood] = useState(city.neighborhoods[0] || '');
  const [difficulty, setDifficulty] = useState<Difficulty>('moderate');
  const [parkingType, setParkingType] = useState<ParkingType>('free');
  const [bestTimes, setBestTimes] = useState('');
  const [notes, setNotes] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setMounted(true), []);

  // Try to grab the user's current location when the modal opens
  useEffect(() => {
    if (isOpen && !coords && typeof navigator !== 'undefined' && navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => {
          // Fall back to the city center if the user denies location
          setCoords({ lat: city.latitude, lng: city.longitude });
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async () => {
    setError('');
    if (!streetName.trim()) {
      setError('Please enter a street name.');
      return;
    }
    if (!coords) {
      setError('Still finding your location — try again in a moment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coords.lat,
          longitude: coords.lng,
          city: city.id,
          neighborhood,
          street_name: streetName.trim(),
          difficulty,
          parking_type: parkingType,
          best_times: bestTimes.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add spot');
      }
      // Reset and notify parent
      setStreetName('');
      setBestTimes('');
      setNotes('');
      setCoords(null);
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
        className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-1">Add Parking Knowledge</h2>
        <p className="text-slate-400 text-sm mb-4">
          {locating
            ? 'Finding your location…'
            : coords
            ? `Sharing a tip near you in ${city.name}`
            : `Location unavailable — will use ${city.name} center`}
        </p>

        <label className="block text-xs text-slate-300 font-semibold mb-1">Street or area</label>
        <input
          type="text"
          value={streetName}
          onChange={(e) => setStreetName(e.target.value)}
          placeholder="e.g. Valencia St between 16th & 17th"
          className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition text-sm mb-4"
        />

        <label className="block text-xs text-slate-300 font-semibold mb-1">Neighborhood</label>
        <select
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition text-sm mb-4"
        >
          {city.neighborhoods.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <label className="block text-xs text-slate-300 font-semibold mb-1">How hard is parking here?</label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`p-2.5 rounded-lg font-semibold text-sm transition ${
                difficulty === d
                  ? `${DIFFICULTY_META[d].chip} text-white`
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {DIFFICULTY_META[d].label}
            </button>
          ))}
        </div>

        <label className="block text-xs text-slate-300 font-semibold mb-1">Parking type</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {PARKING_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setParkingType(t)}
              className={`p-2.5 rounded-lg font-semibold text-sm transition ${
                parkingType === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {PARKING_TYPE_LABEL[t]}
            </button>
          ))}
        </div>

        <label className="block text-xs text-slate-300 font-semibold mb-1">Best times (optional)</label>
        <input
          type="text"
          value={bestTimes}
          onChange={(e) => setBestTimes(e.target.value)}
          placeholder="e.g. After 6pm & weekends"
          className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition text-sm mb-4"
        />

        <label className="block text-xs text-slate-300 font-semibold mb-1">Tips (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Street cleaning Tue 8–10am. 2hr limit. Free lot behind the CVS."
          rows={3}
          className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition text-sm mb-5 resize-none"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || locating}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Adding…' : 'Add Tip'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
