// TransitOps seed data. Kept in one file for easy iteration.
// dates are ISO strings.

const iso = (daysFromToday = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString();
};

export const DEMO_USERS = [
  {
    id: "u-1",
    name: "Marcus Okafor",
    email: "manager@transitops.io",
    password: "demo1234",
    role: "FLEET_MANAGER",
    avatar:
      "https://images.unsplash.com/photo-1506863530036-1efeddceb993?crop=entropy&cs=srgb&fm=jpg&w=200",
  },
  {
    id: "u-2",
    name: "Diego Ramírez",
    email: "driver@transitops.io",
    password: "demo1234",
    role: "DRIVER",
    avatar:
      "https://images.unsplash.com/photo-1626712211690-8de4fe30177c?crop=entropy&cs=srgb&fm=jpg&w=200",
  },
  {
    id: "u-3",
    name: "Ada Sinclair",
    email: "safety@transitops.io",
    password: "demo1234",
    role: "SAFETY_OFFICER",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&w=200",
  },
  {
    id: "u-4",
    name: "Priya Balan",
    email: "finance@transitops.io",
    password: "demo1234",
    role: "FINANCIAL_ANALYST",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&w=200",
  },
];

export const ROLE_LABELS = {
  FLEET_MANAGER: "Fleet Manager",
  DRIVER: "Driver",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

export const VEHICLE_TYPES = ["Semi-Trailer", "Box Truck", "Van", "Tanker", "Flatbed"];
export const REGIONS = ["North", "South", "East", "West", "Central"];

export const seedVehicles = [
  { id: "v-1", regNumber: "TX-4471-BR", name: "Kenworth T680", type: "Semi-Trailer", maxLoad: 26000, odometer: 184320, acquisitionCost: 152000, status: "AVAILABLE", region: "North" },
  { id: "v-2", regNumber: "CA-8812-AL", name: "Volvo VNL 860", type: "Semi-Trailer", maxLoad: 25000, odometer: 92140, acquisitionCost: 165000, status: "ON_TRIP", region: "West" },
  { id: "v-3", regNumber: "NY-1039-KM", name: "Freightliner Cascadia", type: "Semi-Trailer", maxLoad: 24000, odometer: 231500, acquisitionCost: 148000, status: "MAINTENANCE", region: "East" },
  { id: "v-4", regNumber: "FL-2255-PT", name: "Isuzu NPR-HD", type: "Box Truck", maxLoad: 5400, odometer: 63200, acquisitionCost: 58000, status: "AVAILABLE", region: "South" },
  { id: "v-5", regNumber: "IL-7788-QR", name: "Hino 268", type: "Box Truck", maxLoad: 12000, odometer: 118400, acquisitionCost: 72000, status: "ON_TRIP", region: "Central" },
  { id: "v-6", regNumber: "OR-4402-ZX", name: "Mercedes Sprinter 3500", type: "Van", maxLoad: 3200, odometer: 41800, acquisitionCost: 62000, status: "AVAILABLE", region: "West" },
  { id: "v-7", regNumber: "GA-9931-VP", name: "Ford Transit 350", type: "Van", maxLoad: 2100, odometer: 78900, acquisitionCost: 48000, status: "AVAILABLE", region: "South" },
  { id: "v-8", regNumber: "TX-6644-HN", name: "Peterbilt 579", type: "Semi-Trailer", maxLoad: 25500, odometer: 289100, acquisitionCost: 158000, status: "RETIRED", region: "North" },
  { id: "v-9", regNumber: "WA-1188-CD", name: "International MV Tanker", type: "Tanker", maxLoad: 18000, odometer: 96400, acquisitionCost: 132000, status: "AVAILABLE", region: "West" },
  { id: "v-10", regNumber: "AZ-5521-GK", name: "Mack Anthem Flatbed", type: "Flatbed", maxLoad: 22000, odometer: 145200, acquisitionCost: 141000, status: "MAINTENANCE", region: "South" },
  { id: "v-11", regNumber: "OH-3390-YB", name: "Volvo VNR 640", type: "Semi-Trailer", maxLoad: 24500, odometer: 108900, acquisitionCost: 156000, status: "AVAILABLE", region: "Central" },
  { id: "v-12", regNumber: "MA-7702-JL", name: "Isuzu FTR", type: "Box Truck", maxLoad: 10500, odometer: 55600, acquisitionCost: 68000, status: "ON_TRIP", region: "East" },
  { id: "v-13", regNumber: "NV-2244-EW", name: "Ram ProMaster 3500", type: "Van", maxLoad: 4300, odometer: 32100, acquisitionCost: 52000, status: "AVAILABLE", region: "West" },
  { id: "v-14", regNumber: "CO-8817-MN", name: "Kenworth W990", type: "Semi-Trailer", maxLoad: 26500, odometer: 76400, acquisitionCost: 172000, status: "AVAILABLE", region: "Central" },
  { id: "v-15", regNumber: "NC-3311-FO", name: "Freightliner M2 Flatbed", type: "Flatbed", maxLoad: 20000, odometer: 199800, acquisitionCost: 128000, status: "AVAILABLE", region: "South" },
];

export const seedDrivers = [
  { id: "d-1", name: "Diego Ramírez", licenseNumber: "DL-77239841", licenseCategory: "Class A CDL", licenseExpiry: iso(420), contact: "+1 (415) 555-0134", safetyScore: 94, status: "ON_DUTY", region: "West" },
  { id: "d-2", name: "Hanna Voss", licenseNumber: "DL-88451209", licenseCategory: "Class A CDL", licenseExpiry: iso(22), contact: "+1 (312) 555-0187", safetyScore: 88, status: "AVAILABLE", region: "Central" },
  { id: "d-3", name: "Yosef Adem", licenseNumber: "DL-11987744", licenseCategory: "Class B CDL", licenseExpiry: iso(-11), contact: "+1 (713) 555-0219", safetyScore: 71, status: "SUSPENDED", region: "South" },
  { id: "d-4", name: "Rina Okonkwo", licenseNumber: "DL-45612330", licenseCategory: "Class A CDL", licenseExpiry: iso(680), contact: "+1 (929) 555-0155", safetyScore: 96, status: "AVAILABLE", region: "East" },
  { id: "d-5", name: "Camille Beaufort", licenseNumber: "DL-99823117", licenseCategory: "Class C", licenseExpiry: iso(150), contact: "+1 (503) 555-0176", safetyScore: 82, status: "AVAILABLE", region: "West" },
  { id: "d-6", name: "Nikhil Rao", licenseNumber: "DL-33984411", licenseCategory: "Class A CDL", licenseExpiry: iso(9), contact: "+1 (617) 555-0142", safetyScore: 79, status: "AVAILABLE", region: "East" },
  { id: "d-7", name: "Sofía Delgado", licenseNumber: "DL-56774299", licenseCategory: "Class B CDL", licenseExpiry: iso(310), contact: "+1 (305) 555-0111", safetyScore: 91, status: "ON_DUTY", region: "South" },
  { id: "d-8", name: "Karim El-Sayed", licenseNumber: "DL-22118876", licenseCategory: "Class A CDL", licenseExpiry: iso(540), contact: "+1 (206) 555-0125", safetyScore: 87, status: "AVAILABLE", region: "West" },
  { id: "d-9", name: "Maya Iversen", licenseNumber: "DL-77445519", licenseCategory: "Class C", licenseExpiry: iso(90), contact: "+1 (773) 555-0193", safetyScore: 84, status: "AVAILABLE", region: "Central" },
  { id: "d-10", name: "Tomás Herrera", licenseNumber: "DL-66123388", licenseCategory: "Class A CDL", licenseExpiry: iso(220), contact: "+1 (480) 555-0168", safetyScore: 89, status: "AVAILABLE", region: "South" },
  { id: "d-11", name: "Grace Ademola", licenseNumber: "DL-99213377", licenseCategory: "Class A CDL", licenseExpiry: iso(-40), contact: "+1 (216) 555-0104", safetyScore: 65, status: "SUSPENDED", region: "Central" },
  { id: "d-12", name: "Lars Bergqvist", licenseNumber: "DL-33445566", licenseCategory: "Class B CDL", licenseExpiry: iso(28), contact: "+1 (612) 555-0198", safetyScore: 90, status: "ON_DUTY", region: "North" },
];

export const seedTrips = [
  { id: "t-1", source: "Dallas, TX", destination: "Houston, TX", vehicleId: "v-2", driverId: "d-1", cargoWeight: 22000, plannedDistance: 385, status: "DISPATCHED", createdAt: iso(-1), finalOdometer: null, fuelConsumed: null },
  { id: "t-2", source: "Los Angeles, CA", destination: "Phoenix, AZ", vehicleId: "v-5", driverId: "d-7", cargoWeight: 10800, plannedDistance: 372, status: "DISPATCHED", createdAt: iso(-1), finalOdometer: null, fuelConsumed: null },
  { id: "t-3", source: "Boston, MA", destination: "New York, NY", vehicleId: "v-12", driverId: "d-12", cargoWeight: 9200, plannedDistance: 215, status: "DISPATCHED", createdAt: iso(0), finalOdometer: null, fuelConsumed: null },
  { id: "t-4", source: "Chicago, IL", destination: "Detroit, MI", vehicleId: "v-11", driverId: "d-2", cargoWeight: 21000, plannedDistance: 282, status: "DRAFT", createdAt: iso(0), finalOdometer: null, fuelConsumed: null },
  { id: "t-5", source: "Denver, CO", destination: "Salt Lake City, UT", vehicleId: "v-14", driverId: "d-8", cargoWeight: 24500, plannedDistance: 525, status: "DRAFT", createdAt: iso(0), finalOdometer: null, fuelConsumed: null },
  { id: "t-6", source: "Seattle, WA", destination: "Portland, OR", vehicleId: "v-1", driverId: "d-5", cargoWeight: 18000, plannedDistance: 174, status: "COMPLETED", createdAt: iso(-6), finalOdometer: 184320, fuelConsumed: 62 },
  { id: "t-7", source: "Miami, FL", destination: "Orlando, FL", vehicleId: "v-4", driverId: "d-10", cargoWeight: 5000, plannedDistance: 236, status: "COMPLETED", createdAt: iso(-4), finalOdometer: 63200, fuelConsumed: 41 },
  { id: "t-8", source: "Atlanta, GA", destination: "Nashville, TN", vehicleId: "v-7", driverId: "d-4", cargoWeight: 1800, plannedDistance: 249, status: "COMPLETED", createdAt: iso(-3), finalOdometer: 78900, fuelConsumed: 33 },
  { id: "t-9", source: "San Diego, CA", destination: "Las Vegas, NV", vehicleId: "v-6", driverId: "d-1", cargoWeight: 2800, plannedDistance: 331, status: "COMPLETED", createdAt: iso(-8), finalOdometer: 41800, fuelConsumed: 47 },
  { id: "t-10", source: "Portland, OR", destination: "Boise, ID", vehicleId: "v-9", driverId: "d-8", cargoWeight: 15000, plannedDistance: 429, status: "COMPLETED", createdAt: iso(-10), finalOdometer: 96400, fuelConsumed: 88 },
  { id: "t-11", source: "Phoenix, AZ", destination: "Tucson, AZ", vehicleId: "v-15", driverId: "d-10", cargoWeight: 18000, plannedDistance: 116, status: "COMPLETED", createdAt: iso(-12), finalOdometer: 199800, fuelConsumed: 28 },
  { id: "t-12", source: "Charlotte, NC", destination: "Raleigh, NC", vehicleId: "v-13", driverId: "d-4", cargoWeight: 3900, plannedDistance: 168, status: "CANCELLED", createdAt: iso(-2), finalOdometer: null, fuelConsumed: null },
];

export const seedMaintenance = [
  { id: "m-1", vehicleId: "v-3", issue: "Transmission fluid leak, needs gearbox inspection", createdAt: iso(-4), status: "ACTIVE", estimatedCost: 3200 },
  { id: "m-2", vehicleId: "v-10", issue: "Brake pad replacement (front axle)", createdAt: iso(-2), status: "ACTIVE", estimatedCost: 850 },
  { id: "m-3", vehicleId: "v-1", issue: "Annual DOT inspection + tire rotation", createdAt: iso(-18), status: "CLOSED", estimatedCost: 640 },
  { id: "m-4", vehicleId: "v-4", issue: "Refrigeration unit compressor repair", createdAt: iso(-24), status: "CLOSED", estimatedCost: 1450 },
  { id: "m-5", vehicleId: "v-11", issue: "Engine oil change + filter replacement", createdAt: iso(-9), status: "CLOSED", estimatedCost: 320 },
];

export const seedFuelLogs = [
  { id: "f-1", vehicleId: "v-1", liters: 240, cost: 288, date: iso(-6) },
  { id: "f-2", vehicleId: "v-4", liters: 158, cost: 189, date: iso(-4) },
  { id: "f-3", vehicleId: "v-7", liters: 128, cost: 154, date: iso(-3) },
  { id: "f-4", vehicleId: "v-6", liters: 178, cost: 214, date: iso(-8) },
  { id: "f-5", vehicleId: "v-9", liters: 335, cost: 402, date: iso(-10) },
  { id: "f-6", vehicleId: "v-15", liters: 106, cost: 127, date: iso(-12) },
  { id: "f-7", vehicleId: "v-11", liters: 210, cost: 252, date: iso(-14) },
  { id: "f-8", vehicleId: "v-2", liters: 288, cost: 346, date: iso(-2) },
];

export const seedExpenses = [
  { id: "e-1", vehicleId: "v-1", type: "TOLL", cost: 88, date: iso(-6), note: "I-5 toll section" },
  { id: "e-2", vehicleId: "v-3", type: "MAINTENANCE", cost: 3200, date: iso(-4), note: "Gearbox repair" },
  { id: "e-3", vehicleId: "v-10", type: "MAINTENANCE", cost: 850, date: iso(-2), note: "Brake pads" },
  { id: "e-4", vehicleId: "v-7", type: "TOLL", cost: 42, date: iso(-3), note: "Georgia 400" },
  { id: "e-5", vehicleId: "v-2", type: "OTHER", cost: 155, date: iso(-1), note: "Cargo insurance surcharge" },
  { id: "e-6", vehicleId: "v-4", type: "MAINTENANCE", cost: 1450, date: iso(-24), note: "Refrigeration compressor" },
  { id: "e-7", vehicleId: "v-11", type: "MAINTENANCE", cost: 320, date: iso(-9), note: "Oil change" },
  { id: "e-8", vehicleId: "v-9", type: "TOLL", cost: 64, date: iso(-10), note: "Idaho state toll" },
];

// Fleet utilization mini-series (last 7 days, %)
export const seedUtilizationTrend = [
  { day: "Mon", value: 58 },
  { day: "Tue", value: 62 },
  { day: "Wed", value: 71 },
  { day: "Thu", value: 68 },
  { day: "Fri", value: 74 },
  { day: "Sat", value: 66 },
  { day: "Sun", value: 60 },
];
