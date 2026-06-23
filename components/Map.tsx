'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { SpotWithReports } from '@/types';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  spots: SpotWithReports[];
  selectedSpot: SpotWithReports | null;
  onSpotSelect: (spot: SpotWithReports) => void;
}

export function Map({ spots, selectedSpot, onSpotSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Set token from env variable
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error('Mapbox token missing from NEXT_PUBLIC_MAPBOX_TOKEN');
      return;
    }

    if (!mapContainer.current) return;
    if (map.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.2709, 37.8044],
      zoom: 11,
    });

    // Ensure the map sizes itself correctly once the container is laid out
    map.current.on('load', () => {
      map.current?.resize();
      addMarkers(spots);
    });
  }, []);

  useEffect(() => {
    if (map.current) {
      addMarkers(spots);
    }
  }, [spots]);

  const getStatusColor = (status: string): string => {
    return status === 'free' ? '#10b981' : '#ef4444';
  };

  const addMarkers = (spotsToRender: SpotWithReports[]) => {
    if (!map.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    spotsToRender.forEach((spot) => {
      const el = document.createElement('div');
      const color = getStatusColor(spot.status);

      el.style.width = '28px';
      el.style.height = '28px';
      el.style.backgroundColor = color;
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      el.title = spot.street_name;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([spot.longitude, spot.latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => onSpotSelect(spot));
      markersRef.current.push(marker);
    });
  };

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="w-full rounded-lg overflow-hidden border border-gray-200"
        style={{ background: '#e5e7eb', height: '400px', minHeight: '400px' }}
      />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-2">Status</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-600"></div>
            <span className="text-gray-700">Free</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span className="text-gray-700">Taken</span>
          </div>
        </div>
      </div>
    </div>
  );
}
