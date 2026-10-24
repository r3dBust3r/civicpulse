import { CivicReport } from '@/types';

// Calculate distance between two lat/lng points in meters (Haversine formula)
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Find nearby active reports within a given distance threshold (default 60 meters)
export function findNearbyDuplicates(
  newLat: number,
  newLng: number,
  existingReports: CivicReport[],
  thresholdMeters = 60
): { report: CivicReport; distance: number } | null {
  for (const report of existingReports) {
    if (report.status === 'Resolved') continue;
    const dist = calculateDistanceMeters(newLat, newLng, report.location.lat, report.location.lng);
    if (dist <= thresholdMeters) {
      return { report, distance: Math.round(dist) };
    }
  }
  return null;
}

// Reverse Geocode using free OpenStreetMap Nominatim API
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en,fr,ar',
          'User-Agent': 'CivicPulse-FixMyStreet-Hackathon/1.0',
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const addr = data.address;
      if (addr) {
        const road = addr.road || addr.pedestrian || addr.suburb || '';
        const city = addr.city || addr.town || addr.county || 'Rabat';
        if (road) return `${road}, ${city}`;
        return data.display_name.split(',').slice(0, 3).join(',');
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }
  return `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
