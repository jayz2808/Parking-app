'use client';

import { useEffect, useRef, useState } from 'react';
import { ParkingSpot, City, Difficulty, DIFFICULTY_META, PARKING_TYPE_LABEL } from '@/types';
import { Map } from '@/components/Map';
import { SpotCard } from '@/components/SpotCard';
import { AddSpotModal } from '@/components/AddSpotModal';
import { openDirections } from '@/lib/directions';
import { shareSpot } from '@/lib/share';

const CITIES: City[] = [
  {
    id: 'sf',
    name: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 13,
    neighborhoods: ['Mission', 'SOMA', 'Downtown', 'Marina', 'Castro', 'Richmond'],
  },
  {
    id: 'oakland',
    name: 'Oakland',
    latitude: 37.8044,
    longitude: -122.2712,
    zoom: 12,
    neighborhoods: ['Downtown', 'Lake Merritt', 'Rockridge', 'Piedmont', 'Fruitvale'],
  },
  {
    id: 'berkeley',
    name: 'Berkeley',
    latitude: 37.8715,
    longitude: -122.2727,
    zoom: 13,
    neighborhoods: ['Downtown', 'Telegraph Ave', 'North Berkeley', 'South Berkeley'],
  },
  {
    id: 'palo-alto',
    name: 'Palo Alto',
    latitude: 37.4419,
    longitude: -122.143,
    zoom: 13,
    neighborhoods: ['Downtown', 'California Ave', 'Professional Park'],
  },
  {
    id: 'san-jose',
    name: 'San Jose',
    latitude: 37.3382,
    longitude: -121.8863,
    zoom: 12,
    neighborhoods: ['Downtown', 'Japantown', 'East Side', 'North San Jose'],
  },
];

async function getSpots(city: string): Promise<ParkingSpot[]> {
  try {
    const response = await fetch(`/api/spots?city=${city}`);
    const data = await response.json();
    return data.spots || [];
  } catch (error) {
    console.error('Error fetching spots:', error);
    return [];
  }
}

const DIFFICULTY_FILTERS: ('all' | Difficulty)[] = ['all', 'easy', 'moderate', 'hard'];

export default function Home() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [focusKey, setFocusKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | Difficulty>('all');
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const pendingSpotIdRef = useRef<string | null>(null);

  // Handle deep links like /?city=sf&spot=<id> shared by other users
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotParam = params.get('spot');
    const cityParam = params.get('city');
    if (spotParam) pendingSpotIdRef.current = spotParam;
    if (cityParam) {
      const c = CITIES.find((c) => c.id === cityParam);
      if (c) setSelectedCity(c);
    }
  }, []);

  useEffect(() => {
    const loadSpots = async () => {
      setIsLoading(true);
      const data = await getSpots(selectedCity.id);
      setSpots(data);

      // If we arrived via a shared link, select & zoom to that spot
      const pending = pendingSpotIdRef.current;
      const match = pending ? data.find((s) => s.id === pending) : null;
      if (match) {
        setSelectedSpot(match);
        setFocusKey((k) => k + 1);
        pendingSpotIdRef.current = null;
      } else {
        setSelectedSpot(data[0] || null);
      }
      setIsLoading(false);
    };
    loadSpots();
  }, [selectedCity]);

  // Select a spot AND zoom the map to it
  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setFocusKey((k) => k + 1);
  };

  const handleShare = async (spot: ParkingSpot) => {
    const result = await shareSpot(selectedCity.id, spot.id, spot.street_name);
    if (result === 'copied') {
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 2000);
    } else if (result === 'failed') {
      setShareMsg('Could not share');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  const handleSpotAdded = async () => {
    setShowAddSpot(false);
    const updated = await getSpots(selectedCity.id);
    setSpots(updated);
  };

  const easyCount = spots.filter((s) => s.difficulty === 'easy').length;
  const hardCount = spots.filter((s) => s.difficulty === 'hard').length;

  const filteredSpots = spots.filter((spot) => {
    const matchesSearch =
      spot.street_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || spot.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const selectedDiff = selectedSpot
    ? DIFFICULTY_META[selectedSpot.difficulty] ?? DIFFICULTY_META.moderate
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-1 sm:mb-2 leading-tight tracking-tight">
            Parking Cheat Sheet
          </h1>
          <p className="text-slate-300 font-medium text-sm sm:text-base">
            Know where to park before you go — Bay Area local knowledge
          </p>
        </div>
      </div>

      {!isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8 space-y-4">
              {/* Difficulty summary */}
              <div className="flex gap-3">
                <div className="flex-1 bg-green-600/15 border border-green-600/30 rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-green-400">{easyCount}</p>
                  <p className="text-xs text-green-300/80 font-medium">Easy areas</p>
                </div>
                <div className="flex-1 bg-slate-600/20 border border-slate-500/30 rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-slate-200">{spots.length}</p>
                  <p className="text-xs text-slate-300/80 font-medium">Total tips</p>
                </div>
                <div className="flex-1 bg-red-600/15 border border-red-600/30 rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-red-400">{hardCount}</p>
                  <p className="text-xs text-red-300/80 font-medium">Avoid areas</p>
                </div>
              </div>

              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <Map
                  spots={spots}
                  selectedSpot={selectedSpot}
                  onSpotSelect={handleSpotSelect}
                  city={selectedCity}
                  focusKey={focusKey}
                />
              </div>

              {selectedSpot && selectedDiff && (
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-5 border border-slate-600">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold text-lg">{selectedSpot.street_name}</p>
                      <p className="text-slate-400 text-sm mt-1">{selectedSpot.neighborhood}, {selectedCity.name}</p>
                    </div>
                    <span className={`${selectedDiff.chip} rounded px-2.5 py-1 text-white text-xs font-semibold shrink-0`}>
                      {selectedDiff.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="bg-slate-600/60 text-slate-200 text-xs px-2 py-0.5 rounded">
                      {PARKING_TYPE_LABEL[selectedSpot.parking_type] ?? 'Free'}
                    </span>
                    {selectedSpot.best_times && (
                      <span className="bg-slate-600/60 text-slate-200 text-xs px-2 py-0.5 rounded">
                        Best: {selectedSpot.best_times}
                      </span>
                    )}
                  </div>
                  {selectedSpot.notes && (
                    <p className="text-slate-300 text-sm mt-3 leading-relaxed">{selectedSpot.notes}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openDirections(selectedSpot.latitude, selectedSpot.longitude)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg font-medium text-sm transition"
                    >
                      Directions
                    </button>
                    <button
                      onClick={() => handleShare(selectedSpot)}
                      className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-3 py-2.5 rounded-lg font-medium text-sm transition"
                    >
                      {shareMsg || 'Share'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-gradient-to-b from-slate-900 to-transparent pb-4 space-y-3">
              <h2 className="text-2xl font-bold text-white">Parking tips</h2>

              <select
                value={selectedCity.id}
                onChange={(e) => setSelectedCity(CITIES.find(c => c.id === e.target.value) || CITIES[0])}
                className="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition text-sm"
              >
                {CITIES.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search by street or neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition text-sm"
              />

              <div className="grid grid-cols-4 gap-2">
                {DIFFICULTY_FILTERS.map((f) => {
                  const active = difficultyFilter === f;
                  const label = f === 'all' ? 'All' : DIFFICULTY_META[f].label;
                  return (
                    <button
                      key={f}
                      onClick={() => setDifficultyFilter(f)}
                      className={`px-2 py-2 rounded-lg font-medium text-xs transition border ${
                        active
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowAddSpot(true)}
                className="w-full px-4 py-2.5 rounded-lg font-medium text-sm transition bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5"
              >
                <span className="text-lg leading-none">+</span> Add a parking tip
              </button>

              <p className="text-xs text-slate-400">
                Showing {filteredSpots.length} of {spots.length} tips
              </p>
            </div>

            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                className="cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleSpotSelect(spot)}
              >
                <SpotCard
                  spot={spot}
                  onShare={handleShare}
                  shareLabel={selectedSpot?.id === spot.id ? shareMsg || undefined : undefined}
                />
              </div>
            ))}

            {filteredSpots.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No tips yet — be the first to add one!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-block animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-slate-400 text-lg">Loading parking tips...</p>
        </div>
      )}

      <AddSpotModal
        city={selectedCity}
        isOpen={showAddSpot}
        onClose={() => setShowAddSpot(false)}
        onAdded={handleSpotAdded}
      />
    </div>
  );
}
