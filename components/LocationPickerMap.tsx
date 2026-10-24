'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({
  lat,
  lng,
  onChange,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const pinMarkerRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Teardrop Pinpoint
      const pinIcon = L.divIcon({
        className: 'user-pin-marker',
        html: `
          <div style="
            width: 40px;
            height: 48px;
            display: flex;
            flex-direction: column;
            align-items: center;
            filter: drop-shadow(0 4px 8px rgba(2, 132, 199, 0.6));
          ">
            <div class="pin-glow" style="
              background-color: #0284c7;
              width: 36px;
              height: 36px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2.5px solid white;
            ">
              <span style="transform: rotate(45deg); font-size: 16px; line-height: 1;">
                📍
              </span>
            </div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 46],
      });

      const marker = L.marker([lat, lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (e: any) => {
        const pos = e.target.getLatLng();
        if (onChangeRef.current) {
          onChangeRef.current(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
        }
      });

      map.on('click', (e: any) => {
        const newLat = Number(e.latlng.lat.toFixed(6));
        const newLng = Number(e.latlng.lng.toFixed(6));
        marker.setLatLng([newLat, newLng]);
        if (onChangeRef.current) {
          onChangeRef.current(newLat, newLng);
        }
      });

      mapInstanceRef.current = map;
      pinMarkerRef.current = marker;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 300);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  // Pan map and move marker when coordinates update externally
  useEffect(() => {
    if (mapInstanceRef.current && pinMarkerRef.current) {
      pinMarkerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.panTo([lat, lng], { animate: true });
    }
  }, [lat, lng]);

  if (!isClient) {
    return (
      <div className="w-full h-44 bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-400">
        Loading Rabat map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-2 right-2 z-[400] bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-700 shadow flex items-center gap-1 pointer-events-none">
        <MapPin className="w-3 h-3 text-sky-600" />
        <span>Tap map or drag pin to adjust</span>
      </div>
    </div>
  );
}
