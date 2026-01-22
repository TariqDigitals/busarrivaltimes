export function formatArrivalTime(durationMs: number): string {
  if (durationMs <= 0) return 'Arr';
  const minutes = Math.floor(durationMs / 60000);
  if (minutes === 0) return 'Arr';
  if (minutes === 1) return '1 min';
  return `${minutes} min`;
}

export function getLoadColor(load: string): { bg: string; text: string; label: string } {
  switch (load) {
    case 'SEA':
      return { bg: 'bg-emerald-500', text: 'text-emerald-500', label: 'Seats Available' };
    case 'SDA':
      return { bg: 'bg-amber-500', text: 'text-amber-500', label: 'Standing Available' };
    case 'LSD':
      return { bg: 'bg-red-500', text: 'text-red-500', label: 'Limited Standing' };
    default:
      return { bg: 'bg-gray-400', text: 'text-gray-400', label: 'No Data' };
  }
}

export function getBusTypeLabel(type: string): string {
  switch (type) {
    case 'DD':
      return 'Double Decker';
    case 'BD':
      return 'Bendy';
    case 'SD':
      return 'Single Deck';
    default:
      return '';
  }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function calculateWalkingTime(distanceMeters: number): number {
  const walkingSpeedMps = 1.4;
  return Math.round(distanceMeters / walkingSpeedMps / 60);
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
