'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CivicReport } from '@/types';
import { Layers, MapPin, Navigation } from 'lucide-react';

interface CivicMapProps {
  reports: CivicReport[];
  selectedReport: CivicReport | null;
  onSelectReport: (report: CivicReport) => void;
  pinLocation: { lat: number; lng: number } | null;
  onPinChange?: (lat: number, lng: number) => void;
  isPinningMode?: boolean;
}

export default function CivicMap({
  reports,
  selectedReport,
  onSelectReport,
  pinLocation,
  onPinChange,
  isPinningMode = false,
}: CivicMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const heatmapLayerRef = useRef<any>(null);
  const userPinMarkerRef = useRef<any>(null);
  const leafletModuleRef = useRef<any>(null);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Keep callback refs stable to prevent unneeded re-triggers
  const onPinChangeRef = useRef(onPinChange);
  const onSelectReportRef = useRef(onSelectReport);
  const reportsRef = useRef(reports);

  useEffect(() => {
    onPinChangeRef.current = onPinChange;
  }, [onPinChange]);

  useEffect(() => {
    onSelectReportRef.current = onSelectReport;
  }, [onSelectReport]);

  useEffect(() => {
    reportsRef.current = reports;
  }, [reports]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper to render teardrop pinpoints onto map
  const renderMarkers = useCallback((L: any, reportsList: CivicReport[]) => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();
    if (heatmapLayerRef.current) heatmapLayerRef.current.clearLayers();

    reportsList.forEach((rep) => {
      // Color based on status and community severity
      let color = '#0284c7'; // Blue
      if (rep.status === 'Resolved') color = '#10b981'; // Green
      else if (rep.severity === 'Critical') color = '#ef4444'; // Red
      else if (rep.severity === 'High') color = '#f97316'; // Orange
      else if (rep.severity === 'Medium') color = '#eab308'; // Yellow

      const emoji =
        rep.category === 'Pothole'
          ? '🕳️'
          : rep.category === 'Sanitation'
          ? '🗑️'
          : rep.category === 'Lighting'
          ? '💡'
          : rep.category === 'Water & Drainage'
          ? '💧'
          : '⚠️';

      // Teardrop Pinpoint Marker pointing directly at coordinate
      const customPinIcon = L.divIcon({
        className: 'civic-pinpoint-marker',
        html: `
          <div style="
            width: 36px;
            height: 44px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));
          ">
            <div style="
              background-color: ${color};
              width: 34px;
              height: 34px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2.5px solid white;
              ${rep.severity === 'Critical' && rep.status !== 'Resolved' ? 'box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.4);' : ''}
            ">
              <span style="transform: rotate(45deg); font-size: 13px; line-height: 1;">
                ${rep.status === 'Resolved' ? '✓' : emoji}
              </span>
            </div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 42],
      });

      const marker = L.marker([rep.location.lat, rep.location.lng], { icon: customPinIcon });
      marker.on('click', () => {
        if (onSelectReportRef.current) {
          onSelectReportRef.current(rep);
        }
      });

      markersLayerRef.current.addLayer(marker);

      // Community Density Heatmap circles
      if (heatmapLayerRef.current && rep.status !== 'Resolved') {
        const radius = rep.severity === 'Critical' ? 400 : rep.severity === 'High' ? 250 : 150;
        const heatCircle = L.circle([rep.location.lat, rep.location.lng], {
          radius,
          fillColor: color,
          fillOpacity: 0.35,
          stroke: false,
        });
        heatmapLayerRef.current.addLayer(heatCircle);
      }
    });
  }, []);

  // 1. Initialize Leaflet Map ONCE
  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      leafletModuleRef.current = L;

      // Fix default icons if ever used
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Default center strictly on Rabat (Agdal/Hassan/Medina zone)
      const rabatCenter: [number, number] = [34.015, -6.835];
      const map = L.map(mapContainerRef.current, {
        center: rabatCenter,
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap clean tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const heatmapGroup = L.layerGroup();

      mapInstanceRef.current = map;
      markersLayerRef.current = markersGroup;
      heatmapLayerRef.current = heatmapGroup;

      // IMMEDIATELY render default pinpoints without waiting for click!
      renderMarkers(L, reportsRef.current);
      setMapReady(true);

      // Invalidate sizes at intervals to ensure perfect canvas rendering
      [50, 150, 400].forEach((delay) => {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, delay);
      });

      // Click to pin on map only when pinning mode is explicitly enabled
      map.on('click', (e: any) => {
        if (isPinningMode && onPinChangeRef.current) {
          onPinChangeRef.current(
            Number(e.latlng.lat.toFixed(6)),
            Number(e.latlng.lng.toFixed(6))
          );
        }
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, renderMarkers]);

  // 2. Re-render markers whenever reports change or map becomes ready
  useEffect(() => {
    if (!mapReady || !leafletModuleRef.current) return;
    renderMarkers(leafletModuleRef.current, reports);
  }, [mapReady, reports, renderMarkers]);

  // 3. Toggle Heatmap Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !heatmapLayerRef.current) return;
    if (showHeatmap) {
      mapInstanceRef.current.addLayer(heatmapLayerRef.current);
    } else {
      mapInstanceRef.current.removeLayer(heatmapLayerRef.current);
    }
  }, [showHeatmap]);

  // 4. Update Draggable Active Pinpoint
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletModuleRef.current) return;

    const L = leafletModuleRef.current;

    if (!pinLocation || !isPinningMode) {
      if (userPinMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userPinMarkerRef.current);
        userPinMarkerRef.current = null;
      }
      return;
    }

    if (userPinMarkerRef.current) {
      userPinMarkerRef.current.setLatLng([pinLocation.lat, pinLocation.lng]);
    } else {
      const pinIcon = L.divIcon({
        className: 'active-user-pinpoint',
        html: `
          <div style="
            width: 44px;
            height: 52px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: move;
            filter: drop-shadow(0 6px 12px rgba(2, 132, 199, 0.5));
          ">
            <div class="pin-glow" style="
              background-color: #0284c7;
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
            ">
              <span style="transform: rotate(45deg); font-size: 18px; line-height: 1;">
                📍
              </span>
            </div>
          </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 50],
      });

      const newMarker = L.marker([pinLocation.lat, pinLocation.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(mapInstanceRef.current);

      newMarker.on('dragend', (e: any) => {
        const newPos = e.target.getLatLng();
        if (onPinChangeRef.current) {
          onPinChangeRef.current(
            Number(newPos.lat.toFixed(6)),
            Number(newPos.lng.toFixed(6))
          );
        }
      });

      userPinMarkerRef.current = newMarker;
    }

    mapInstanceRef.current.flyTo([pinLocation.lat, pinLocation.lng], 16, { duration: 1.0 });
  }, [pinLocation]);

  // 5. Center on Selected Report
  useEffect(() => {
    if (selectedReport && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedReport.location.lat, selectedReport.location.lng],
        16,
        { duration: 1.0 }
      );
    }
  }, [selectedReport]);

  const handleRecenterRabat = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([34.015, -6.835], 14, { duration: 1.0 });
  };

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[420px] bg-slate-100 flex items-center justify-center rounded-2xl border border-slate-200">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <MapPin className="w-8 h-8 animate-bounce text-sky-600" />
          <span className="text-sm font-medium">Loading Rabat community map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />

      {/* Floating Controls */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        {/* Heatmap Toggle */}
        <button
          type="button"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl shadow-md backdrop-blur transition-all ${
            showHeatmap
              ? 'bg-amber-500 text-white shadow-amber-500/30 ring-2 ring-amber-300'
              : 'bg-white/95 text-slate-700 hover:bg-white shadow-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          {showHeatmap ? 'Heatmap: ON' : 'Hazard Heatmap'}
        </button>

        {/* Recenter Rabat Button */}
        <button
          type="button"
          onClick={handleRecenterRabat}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/95 text-slate-700 hover:bg-white rounded-xl shadow-md backdrop-blur"
          title="Recenter on Rabat"
        >
          <Navigation className="w-4 h-4 text-sky-600" />
          Rabat Center
        </button>
      </div>

      {/* Pinning Banner */}
      {isPinningMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur flex items-center gap-2 pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span>Tap anywhere on Rabat map to place pin</span>
        </div>
      )}
    </div>
  );
}
