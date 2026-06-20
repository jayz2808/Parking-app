export type ParkingStatus = 'free' | 'taken';

export interface ParkingSpot {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  neighborhood: string;
  status: ParkingStatus;
  street_name: string;
  notes?: string;
}

export interface ParkingReport {
  id: string;
  spot_id: string;
  status: ParkingStatus;
  timestamp: string;
  user_id?: string;
}

export interface SpotWithReports extends ParkingSpot {
  recent_reports: number;
  last_report_time: string;
  report_count_1h: number;
}

export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  zoom: number;
  neighborhoods: string[];
}
