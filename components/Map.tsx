'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { ParkingSpot, City, DIFFICULTY_META, PARKING_TYPE_LABEL } from '@/types';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  spots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  onSpotSelect: (spot: ParkingSpot) => void;
  city: City;
  focusKey: number;
}

const SOURCE_ID = 'parking-spots';
const CIRCLE_LAYER = 'spot-circles';
const SELECTED_LAYER = 'spot-selected';

function toGeoJSON(spots: ParkingSpot[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: spots.map((s) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [s.longitude, s.latitude] },
      properties: { id: s.id, difficulty: s.difficulty },
    })),
  };
}

export function Map({ spots, selectedSpot, onSpotSelect, city, focusKey }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const loadedRef = useRef(false);
  // Keep the latest spots so the click handler (bound once) can look them up
  const spotsRef = useRef<ParkingSpot[]>(spots);
  spotsRef.current = spots;

  useEffect(() => {
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
      center: [city.longitude, city.latitude],
      zoom: city.zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      const m = map.current!;
      m.resize();

      m.addSource(SOURCE_ID, { type: 'geojson', data: toGeoJSON(spotsRef.current) });

      // Selected highlight ring (drawn underneath the main dot)
      m.addLayer({
        id: SELECTED_LAYER,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['==', ['get', 'id'], selectedSpot?.id ?? '__none__'],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 9, 16, 14],
          'circle-color': '#3b82f6',
          'circle-opacity': 0.35,
        },
      });

      // Main dots — colored by difficulty, scale smoothly with zoom on the GPU
      m.addLayer({
        id: CIRCLE_LAYER,
        type: 'circle',
        source: SOURCE_ID,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 16, 9],
          'circle-color': [
            'match',
            ['get', 'difficulty'],
            'easy', DIFFICULTY_META.easy.color,
            'moderate', DIFFICULTY_META.moderate.color,
            'hard', DIFFICULTY_META.hard.color,
            DIFFICULTY_META.moderate.color,
          ],
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
        },
      });

      m.on('click', CIRCLE_LAYER, (e) => {
        const id = e.features?.[0]?.properties?.id;
        const spot = spotsRef.current.find((s) => s.id === id);
        if (spot) onSpotSelect(spot);
      });
      m.on('mouseenter', CIRCLE_LAYER, () => { m.getCanvas().style.cursor = 'pointer'; });
      m.on('mouseleave', CIRCLE_LAYER, () => { m.getCanvas().style.cursor = ''; });

      loadedRef.current = true;
    });
  }, []);

  // Update dot data when the spots list changes
  useEffect(() => {
    if (!map.current || !loadedRef.current) return;
    const src = map.current.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    src?.setData(toGeoJSON(spots));
  }, [spots]);

  // Highlight the selected dot
  useEffect(() => {
    if (!map.current || !loadedRef.current) return;
    map.current.setFilter(SELECTED_LAYER, ['==', ['get', 'id'], selectedSpot?.id ?? '__none__']);
  }, [selectedSpot]);

  // Recenter the map when the user switches cities
  useEffect(() => {
    if (map.current) {
      popupRef.current?.remove();
      map.current.flyTo({
        center: [city.longitude, city.latitude],
        zoom: city.zoom,
        essential: true,
      });
    }
  }, [city]);

  // Zoom into a spot when the user clicks a dot or a card
  useEffect(() => {
    if (!map.current || !selectedSpot || focusKey === 0) return;

    map.current.flyTo({
      center: [selectedSpot.longitude, selectedSpot.latitude],
      zoom: 16,
      essential: true,
    });

    showPopup(selectedSpot);
  }, [focusKey]);

  const showPopup = (spot: ParkingSpot) => {
    if (!map.current) return;
    popupRef.current?.remove();

    const diff = DIFFICULTY_META[spot.difficulty] ?? DIFFICULTY_META.moderate;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isApple = /iPhone|iPad|iPod|Macintosh/.test(ua);
    const directionsUrl = isApple
      ? `https://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}&dirflg=d`
      : `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;

    const html = `
      <div style="font-family: system-ui, sans-serif; min-width: 170px;">
        <div style="font-weight: 600; font-size: 13px; color: #111;">${spot.street_name}</div>
        <div style="font-size: 11px; color: #666; margin-bottom: 4px;">${spot.neighborhood}</div>
        <div style="font-size: 12px; font-weight: 600; color: ${diff.color};">
          ${diff.label} parking
        </div>
        <div style="font-size: 11px; color: #444; margin-top: 2px;">${PARKING_TYPE_LABEL[spot.parking_type] ?? 'Free'}${
          spot.best_times ? ` · Best: ${spot.best_times}` : ''
        }</div>
        ${spot.notes ? `<div style="font-size: 11px; color: #666; margin-top: 4px; line-height: 1.4;">${spot.notes}</div>` : ''}
        <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer"
           style="display:inline-block; margin-top:8px; font-size:12px; font-weight:600; color:#2563eb; text-decoration:none;">
          Get directions →
        </a>
      </div>`;

    popupRef.current = new mapboxgl.Popup({ offset: 16, closeButton: true })
      .setLngLat([spot.longitude, spot.latitude])
      .setHTML(html)
      .addTo(map.current);
  };

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="w-full rounded-lg overflow-hidden border border-gray-200 h-[320px] sm:h-[400px]"
        style={{ background: '#e5e7eb', minHeight: '320px' }}
      />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-2">Parking difficulty</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-600"></div>
            <span className="text-gray-700">Easy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-700">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span className="text-gray-700">Hard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
