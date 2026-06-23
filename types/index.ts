// Difficulty of finding parking at a spot — the core durable signal.
export type Difficulty = 'easy' | 'moderate' | 'hard';

// What kind of parking is available here.
export type ParkingType = 'free' | 'metered' | 'permit' | 'mixed';

export interface ParkingSpot {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  neighborhood: string;
  street_name: string;
  difficulty: Difficulty;
  parking_type: ParkingType;
  // Free-text: when parking is easiest, e.g. "After 6pm & weekends".
  best_times?: string;
  // Local knowledge: time limits, street cleaning, hidden lots, etc.
  notes?: string;
  created_at?: string;
}

export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  zoom: number;
  neighborhoods: string[];
}

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; color: string; chip: string }
> = {
  easy: { label: 'Easy', color: '#10b981', chip: 'bg-green-600' },
  moderate: { label: 'Moderate', color: '#f59e0b', chip: 'bg-amber-500' },
  hard: { label: 'Hard', color: '#ef4444', chip: 'bg-red-600' },
};

export const PARKING_TYPE_LABEL: Record<ParkingType, string> = {
  free: 'Free',
  metered: 'Metered',
  permit: 'Permit only',
  mixed: 'Mixed',
};
