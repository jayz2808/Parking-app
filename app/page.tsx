'use client';

import { useEffect, useState } from 'react';
import { SpotWithReports, City } from '@/types';
import { Map } from '@/components/Map';
import { SpotCard } from '@/components/SpotCard';

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
    neighborhoods: ['Downtown', 'California Ave', 'Profesional Park'],
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

async function getSpotsWithReports(city: string): Promise<SpotWithReports[]> {
  try {
    const response = await fetch(`/api/spots?city=${city}`);
    const data = await response.json();
    return data.spots || [];
  } catch (error) {
    console.error('Error fetching spots:', error);
    return [];
  }
}

export default function Home() {
  const [spots, setSpots] = useState<SpotWithReports[]>([]);
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [selectedSpot, setSelectedSpot] = useState<SpotWithReports | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadSpots = async () => {
      setIsLoading(true);
      const data = await getSpotsWithReports(selectedCity.id);
      setSpots(data);
      setSelectedSpot(data[0] || null);
      setIsLoading(false);
    };
    loadSpots();
  }, [selectedCity]);

  const handleReportSubmitted = async () => {
    const updated = await getSpotsWithReports(selectedCity.id);
    setSpots(updated);
  };

  const filteredSpots = spots.filter(
    (spot) =>
      spot.street_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-5xl font-bold text-white mb-2 leading-tight tracking-tight">
            Parking Spots
          </h1>
          <p className="text-slate-300 font-medium">Find free parking in real-time</p>
        </div>
      </div>

      {!isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 max-w-7xl mx-auto px-6 py-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-4">
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <Map spots={spots} selectedSpot={selectedSpot} onSpotSelect={setSelectedSpot} />
              </div>

              {selectedSpot && (
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-5 border border-slate-600">
                  <p className="text-white font-semibold text-lg">{selectedSpot.street_name}</p>
                  <p className="text-slate-400 text-sm mt-2">{selectedSpot.neighborhood}, {selectedCity.name}</p>
                  <div className="flex justify-between mt-3 text-sm text-slate-300">
                    <span className={selectedSpot.status === 'free' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                      {selectedSpot.status === 'free' ? '✓ Free' : '✗ Taken'}
                    </span>
                    <span className="text-slate-400">{selectedSpot.recent_reports} reports</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            <div className="sticky top-0 bg-gradient-to-b from-slate-900 to-transparent pb-4 space-y-3">
              <h2 className="text-2xl font-bold text-white">Spots</h2>

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

              {searchQuery && (
                <p className="text-xs text-slate-400">
                  Found {filteredSpots.length} spots
                </p>
              )}
            </div>

            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                className="cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => setSelectedSpot(spot)}
              >
                <SpotCard spot={spot} onReportSubmitted={handleReportSubmitted} />
              </div>
            ))}

            {filteredSpots.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No spots found</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-block animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-slate-400 text-lg">Loading parking spots...</p>
        </div>
      )}
    </div>
  );
}
