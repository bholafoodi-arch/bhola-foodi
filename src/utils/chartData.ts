// Beautiful mock and dynamic chart datasets for Bhola Food Delivery Admin Dashboard

export interface VisitorInsightData {
  name: string;
  loyal: number;
  newCustomers: number;
  unique: number;
}

export interface RevenueData {
  name: string;
  online: number;
  offline: number;
}

export interface SatisfactionData {
  name: string;
  lastMonth: number;
  thisMonth: number;
}

export interface TargetRealityData {
  name: string;
  reality: number;
  target: number;
}

export interface VolumeServiceData {
  name: string;
  volume: number;
  services: number;
}

export const VISITOR_INSIGHTS_DATA: VisitorInsightData[] = [
  { name: 'Jan', loyal: 280, newCustomers: 220, unique: 310 },
  { name: 'Feb', loyal: 340, newCustomers: 260, unique: 350 },
  { name: 'Mar', loyal: 310, newCustomers: 210, unique: 370 },
  { name: 'Apr', loyal: 260, newCustomers: 170, unique: 320 },
  { name: 'May', loyal: 290, newCustomers: 190, unique: 290 },
  { name: 'Jun', loyal: 330, newCustomers: 270, unique: 340 },
  { name: 'Jul', loyal: 315, newCustomers: 350, unique: 310 },
  { name: 'Aug', loyal: 280, newCustomers: 320, unique: 290 },
  { name: 'Sep', loyal: 250, newCustomers: 280, unique: 260 },
  { name: 'Oct', loyal: 290, newCustomers: 230, unique: 300 },
  { name: 'Nov', loyal: 220, newCustomers: 180, unique: 240 },
  { name: 'Dec', loyal: 180, newCustomers: 150, unique: 200 },
];

export const REVENUE_DATA: RevenueData[] = [
  { name: 'Mon', online: 14000, offline: 12000 },
  { name: 'Tue', online: 17000, offline: 11500 },
  { name: 'Wed', online: 6000, offline: 21000 },
  { name: 'Thu', online: 16000, offline: 6500 },
  { name: 'Fri', online: 11000, offline: 10500 },
  { name: 'Sat', online: 17000, offline: 13000 },
  { name: 'Sun', online: 21000, offline: 11000 },
];

export const SATISFACTION_DATA: SatisfactionData[] = [
  { name: 'Week 1', lastMonth: 3100, thisMonth: 4200 },
  { name: 'Week 2', lastMonth: 3800, thisMonth: 4900 },
  { name: 'Week 3', lastMonth: 2900, thisMonth: 3900 },
  { name: 'Week 4', lastMonth: 3500, thisMonth: 4500 },
  { name: 'Week 5', lastMonth: 4500, thisMonth: 5400 },
];

export const TARGET_REALITY_DATA: TargetRealityData[] = [
  { name: 'Jan', reality: 7200, target: 8500 },
  { name: 'Feb', reality: 6100, target: 7800 },
  { name: 'Mar', reality: 5500, target: 8200 },
  { name: 'Apr', reality: 8400, target: 9100 },
  { name: 'May', reality: 8900, target: 10200 },
  { name: 'Jun', reality: 9200, target: 10100 },
  { name: 'Jul', reality: 8823, target: 12122 },
];

export const VOLUME_SERVICE_DATA: VolumeServiceData[] = [
  { name: 'Hub 1', volume: 800, services: 600 },
  { name: 'Hub 2', volume: 950, services: 750 },
  { name: 'Hub 3', volume: 700, services: 550 },
  { name: 'Hub 4', volume: 850, services: 680 },
  { name: 'Hub 5', volume: 600, services: 490 },
];

export interface TopProduct {
  id: string;
  name: string;
  popularity: number;
  salesPercentage: number;
  color: string;
}

export const TOP_PRODUCTS: TopProduct[] = [
  { id: '01', name: 'Special Bhola Rosgolla (স্পেশাল রসগোল্লা)', popularity: 85, salesPercentage: 45, color: '#3B82F6' },
  { id: '02', name: 'Charfassion Premium Biryani (কাচ্চি বিরিয়ানি)', popularity: 70, salesPercentage: 29, color: '#10B981' },
  { id: '03', name: 'Sadar Road Beef Chui Jhal (গরুর চুইঝাল)', popularity: 55, salesPercentage: 18, color: '#8B5CF6' },
  { id: '04', name: 'Lalmohan Sweet Curd (লালমোহন মিষ্টি দই)', popularity: 60, salesPercentage: 25, color: '#F59E0B' },
];

export interface HubDensity {
  name: string;
  density: string;
  orders: number;
  riders: number;
  color: string;
}

export const HUB_DENSITIES: HubDensity[] = [
  { name: 'Sadar Road Hub', density: 'High Density', orders: 284, riders: 12, color: 'bg-red-500' },
  { name: 'Charfassion Link', density: 'Medium Density', orders: 198, riders: 8, color: 'bg-amber-500' },
  { name: 'Lalmohan Station', density: 'Medium Density', orders: 124, riders: 5, color: 'bg-indigo-500' },
  { name: 'Tazumuddin Bazar', density: 'Low Density', orders: 78, riders: 3, color: 'bg-emerald-500' },
];
