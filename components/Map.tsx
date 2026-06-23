'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { SpotWithReports, City } from '@/types';
import { timeAgo } from '@/lib/relativeTime';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  spots: SpotWithReports[];
  selectedSpot: SpotWithReports | null;
  onSpotSelect: (spot: SpotWithReports) => void;
  city: City;
  focusKey: number;
}

export function Map({ spots, selectedSpot, onSpotSelect, city, focusKey }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);

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

    // Zoom +/- buttons
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    // "Near me" — locate the user, show a blue dot, recenter on their location
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      map.current?.resize();
      addMarkers(spots);
    });
  }, []);

  useEffect(() => {
    if (map.current) {
      addMarkers(spots);
    }
  }, [spots, selectedSpot]);

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

  const getStatusColor = (status: string): string => {
    return status === 'free' ? '#10b981' : '#ef4444';
  };

  const showPopup = (spot: SpotWithReports) => {
    if (!map.current) return;
    popupRef.current?.remove();

    const isFree = spot.status === 'free';
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isApple = /iPhone|iPad|iPod|Macintosh/.test(ua);
    const directionsUrl = isApple
      ? `https://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}&dirflg=d`
      : `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;

    const html = `
      <div style="font-family: system-ui, sans-serif; min-width: 150px;">
        <div style="font-weight: 600; font-size: 13px; color: #111;">${spot.street_name}</div>
        <div style="font-size: 11px; color: #666; margin-bottom: 4px;">${spot.neighborhood}</div>
        <div style="font-size: 12px; font-weight: 600; color: ${isFree ? '#059669' : '#dc2626'};">
          ${isFree ? '✓ Free' : '✗ Taken'}
        </div>
        <div style="font-size: 11px; color: #888; margin-top: 2px;">${timeAgo(spot.last_report_time)}</div>
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

  const addMarkers = (spotsToRender: SpotWithReports[]) => {
    if (!map.current) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    spotsToRender.forEach((spot) => {
      const color = getStatusColor(spot.status);
      const isSelected = selectedSpot?.id === spot.id;
      const size = isSelected ? 18 : 12;

      // Larger transparent hit area so dots are easy to click without looking big
      const hit = document.createElement('div');
      hit.style.width = '30px';
      hit.style.height = '30px';
      hit.style.display = 'flex';
      hit.style.alignItems = 'center';
      hit.style.justifyContent = 'center';
      hit.style.cursor = 'pointer';
      hit.title = spot.street_name;

      // The visible dot, centered inside the hit area
      const dot = document.createElement('div');
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.backgroundColor = color;
      dot.style.borderRadius = '50%';
      dot.style.border = isSelected ? '3px solid #3b82f6' : '1.5px solid white';
      dot.style.boxShadow = '0 1px 3px rgba(0,0,0,0.4)';
      dot.style.transition = 'transform 0.12s ease';
      hit.appendChild(dot);

      // Subtle grow on hover so it's clear the dot is clickable
      hit.addEventListener('mouseenter', () => { dot.style.transform = 'scale(1.4)'; });
      hit.addEventListener('mouseleave', () => { dot.style.transform = 'scale(1)'; });

      const marker = new mapboxgl.Marker({ element: hit })
        .setLngLat([spot.longitude, spot.latitude])
        .addTo(map.current!);

      hit.addEventListener('click', () => onSpotSelect(spot));
      markersRef.current[spot.id] = marker;
    });
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
