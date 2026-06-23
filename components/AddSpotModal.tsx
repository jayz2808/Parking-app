'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { City } from '@/types';

interface AddSpotModalProps {
  city: City;
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export function AddSpotModal({ city, isOpen, onClose, onAdded }: AddSpotModalProps) {
  const [mounted, setMounted] = useState(false);
  const [streetName, setStreetName] = useState('');
  const [neighborhood, setNeighborhood] = useState(city.neighborhoods[0] || '');
  const [status, setStatus] = useState<'free' | 'taken'>('free');
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
          status,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add spot');
      }
      // Reset and notify parent
      setStreetName('');
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
        className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-1">Add a Parking Spot</h2>
        <p className="text-slate-400 text-sm mb-4">
          {locating
            ? 'Finding your location…'
            : coords
            ? `Using your location in ${city.name}`
            : `Location unavailable — will use ${city.name} center`}
        </p>

        <label className="block text-xs text-slate-300 font-semibold mb-1">Street name</label>
        <input
          type="text"
          value={streetName}
          onChange={(e) => setStreetName(e.target.value)}
          placeholder="e.g. Market Street"
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

        <label className="block text-xs text-slate-300 font-semibold mb-1">Current status</label>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => setStatus('free')}
            className={`p-3 rounded-lg font-semibold transition ${
              status === 'free' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setStatus('taken')}
            className={`p-3 rounded-lg font-semibold transition ${
              status === 'taken' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || locating}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Adding…' : 'Add Spot'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
