import { Farm, Alert, Task, TrendMetric } from './types';

export const initialFarms: Farm[] = [
  {
    id: 1,
    name: "Sunrise Farm",
    province: "Province A",
    status: "Healthy",
    trend: 10,
    cropType: "Wheat",
    manager: "Sarah Jenkins",
    temperature: 24,
    soilMoisture: 42,
    waterUsage: 1200,
    irrigationActive: false,
    lastUpdated: "10 mins ago",
    description: "Sunrise Farm is a highly optimized wheat cultivating plot utilizing state-of-the-art automated soil moisture probes and variable rate fertilization systems.",
    history: [
      { date: "Mon", production: 110, waterUsage: 1300, soilMoisture: 40 },
      { date: "Tue", production: 112, waterUsage: 1280, soilMoisture: 41 },
      { date: "Wed", production: 115, waterUsage: 1250, soilMoisture: 43 },
      { date: "Thu", production: 118, waterUsage: 1220, soilMoisture: 42 },
      { date: "Fri", production: 121, waterUsage: 1200, soilMoisture: 42 }
    ]
  },
  {
    id: 2,
    name: "Golden Fields",
    province: "Province A",
    status: "Attention",
    trend: 2,
    cropType: "Canola",
    manager: "Marcus Vance",
    temperature: 26,
    soilMoisture: 33, 
    waterUsage: 1800,
    irrigationActive: false,
    lastUpdated: "5 mins ago",
    description: "Golden Fields primarily cultivates Canola crops. The crop has reached optimal harvest maturity. Irrigation has been halted to allow the soil to dry for heavy combine machinery deployment today.",
    history: [
      { date: "Mon", production: 95, waterUsage: 1600, soilMoisture: 38 },
      { date: "Tue", production: 96, waterUsage: 1700, soilMoisture: 36 },
      { date: "Wed", production: 96, waterUsage: 1750, soilMoisture: 35 },
      { date: "Thu", production: 97, waterUsage: 1800, soilMoisture: 33 },
      { date: "Fri", production: 98, waterUsage: 0, soilMoisture: 33 } 
    ]
  },
  {
    id: 3,
    name: "Green Valley",
    province: "Province A",
    status: "Critical",
    trend: -8,
    cropType: "Corn",
    manager: "Elena Rostova",
    temperature: 28,
    soilMoisture: 18, // Critically low moisture due to failure
    waterUsage: 0, // Zero flow because irrigation is failed!
    irrigationActive: false,
    lastUpdated: "Just now",
    description: "Located in the low basin of Province A, Green Valley is suffering from a primary irrigation pipe burst, causing automated watering systems to fail entirely.",
    history: [
      { date: "Mon", production: 105, waterUsage: 1500, soilMoisture: 42 },
      { date: "Tue", production: 104, waterUsage: 1450, soilMoisture: 38 },
      { date: "Wed", production: 100, waterUsage: 1200, soilMoisture: 32 },
      { date: "Thu", production: 94, waterUsage: 400, soilMoisture: 24 },
      { date: "Fri", production: 88, waterUsage: 0, soilMoisture: 18 }
    ]
  },
  {
    id: 4,
    name: "Hilltop Farm",
    province: "Province A",
    status: "Healthy",
    trend: 15,
    cropType: "Soybeans",
    manager: "David Cho",
    temperature: 21,
    soilMoisture: 45,
    waterUsage: 950,
    irrigationActive: false,
    lastUpdated: "15 mins ago",
    description: "Positioned on the high plateaus of Province A, Hilltop Farm enjoys consistent weather and excellent organic composting coverage, leading to record performance.",
    history: [
      { date: "Mon", production: 120, waterUsage: 900, soilMoisture: 44 },
      { date: "Tue", production: 125, waterUsage: 920, soilMoisture: 45 },
      { date: "Wed", production: 130, waterUsage: 910, soilMoisture: 45 },
      { date: "Thu", production: 132, waterUsage: 930, soilMoisture: 46 },
      { date: "Fri", production: 135, waterUsage: 950, soilMoisture: 45 }
    ]
  },
  {
    id: 5,
    name: "Riverbend",
    province: "Province B",
    status: "Attention",
    trend: -1,
    cropType: "Barley",
    manager: "Liam O'Connor",
    temperature: 23,
    soilMoisture: 31,
    waterUsage: 2100,
    irrigationActive: true,
    lastUpdated: "8 mins ago",
    description: "Bordered by the regional river flow, Riverbend is dealing with high soil erosion and rapid nutrient drainage, requiring closer monitoring and active fertilizing.",
    history: [
      { date: "Mon", production: 89, waterUsage: 1950, soilMoisture: 34 },
      { date: "Tue", production: 88, waterUsage: 2000, soilMoisture: 33 },
      { date: "Wed", production: 88, waterUsage: 2050, soilMoisture: 32 },
      { date: "Thu", production: 87, waterUsage: 2100, soilMoisture: 31 },
      { date: "Fri", production: 87, waterUsage: 2100, soilMoisture: 31 }
    ]
  },
  {
    id: 6,
    name: "Oak Fields",
    province: "Province B",
    status: "Critical",
    trend: -12,
    cropType: "Potatoes",
    manager: "Chloe Dupont",
    temperature: 22,
    soilMoisture: 48, // High moisture, potentially encouraging disease
    waterUsage: 1100,
    irrigationActive: false,
    lastUpdated: "2 mins ago",
    description: "Oak Fields has reported an active outbreak of late blight fungal disease in Sector 4, which is spreading rapidly due to damp conditions and requires immediate crop dusting.",
    history: [
      { date: "Mon", production: 112, waterUsage: 1300, soilMoisture: 45 },
      { date: "Tue", production: 108, waterUsage: 1250, soilMoisture: 46 },
      { date: "Wed", production: 102, waterUsage: 1200, soilMoisture: 47 },
      { date: "Thu", production: 95, waterUsage: 1150, soilMoisture: 48 },
      { date: "Fri", production: 88, waterUsage: 1100, soilMoisture: 48 }
    ]
  },
  {
    id: 7,
    name: "Meadow View",
    province: "Province B",
    status: "Attention",
    trend: 3,
    cropType: "Oats",
    manager: "Robert Chen",
    temperature: 25,
    soilMoisture: 35,
    waterUsage: 1400,
    irrigationActive: false,
    lastUpdated: "20 mins ago",
    description: "Meadow View operates on stable loam soils but is awaiting regular equipment maintenance on its seed drill, creating bottlenecks for the upcoming winter planting schedules.",
    history: [
      { date: "Mon", production: 100, waterUsage: 1350, soilMoisture: 36 },
      { date: "Tue", production: 101, waterUsage: 1380, soilMoisture: 35 },
      { date: "Wed", production: 101, waterUsage: 1400, soilMoisture: 35 },
      { date: "Thu", production: 102, waterUsage: 1400, soilMoisture: 35 },
      { date: "Fri", production: 103, waterUsage: 1400, soilMoisture: 35 }
    ]
  },
  {
    id: 8,
    name: "Pine Acres",
    province: "Province B",
    status: "Healthy",
    trend: 7,
    cropType: "Sunflowers",
    manager: "Amara Kante",
    temperature: 27,
    soilMoisture: 40,
    waterUsage: 1600,
    irrigationActive: false,
    lastUpdated: "12 mins ago",
    description: "Pine Acres is a flourishing sunflower crop field experiencing perfect weather and high pollinator activity, boasting consistent gains and optimal water cycles.",
    history: [
      { date: "Mon", production: 98, waterUsage: 1500, soilMoisture: 39 },
      { date: "Tue", production: 100, waterUsage: 1550, soilMoisture: 40 },
      { date: "Wed", production: 102, waterUsage: 1600, soilMoisture: 41 },
      { date: "Thu", production: 104, waterUsage: 1600, soilMoisture: 40 },
      { date: "Fri", production: 105, waterUsage: 1600, soilMoisture: 40 }
    ]
  }
];

export const initialAlerts: Alert[] = [
  {
    id: "alert-1",
    farmId: 3,
    farmName: "Green Valley",
    province: "Province A",
    title: "Irrigation system failure",
    severity: "Critical",
    timestamp: "6:30 AM",
    duration: "Since 6:30 AM",
    details: "The main feed pipe in sector 2 ruptured, triggering a pressure drop. Soil moisture is falling fast (currently at 18%). Pump turned off automatically to prevent motor burnout.",
    resolved: false
  },
  {
    id: "alert-2",
    farmId: 6,
    farmName: "Oak Fields",
    province: "Province B",
    title: "Crop disease detected",
    severity: "Warning",
    timestamp: "5:15 AM",
    duration: "Since 5:15 AM",
    details: "Automated leaf spectrum cameras detected patterns of Late Blight Fungal Infection (Phytophthora infestans) across 15% of Sector 4 potato plants. Spread risk is high due to morning mist.",
    resolved: false
  }
];

export const initialTasks: Task[] = [
  {
    id: "task-1",
    farmId: 2,
    farmName: "Golden Fields",
    title: "Harvest due today",
    priority: "High",
    dueDate: "Today",
    completed: false,
    assignedTo: "Marcus Vance",
    description: "Canola moisture content has reached the target 8.5%. Combine harvesters must be deployed today to capitalize on the dry weather windows before tonight's rain."
  },
  {
    id: "task-2",
    farmId: 5,
    farmName: "Riverbend",
    title: "Low fertilizer stock",
    priority: "Medium",
    dueDate: "Today",
    completed: false,
    assignedTo: "Liam O'Connor",
    description: "Liquid nitrogen stock is down to 10% (below 500L reorder threshold). Coordinate delivery from local warehouse to prevent delaying the next crop cycle."
  },
  {
    id: "task-3",
    farmId: 7,
    farmName: "Meadow View",
    title: "Equipment maintenance",
    priority: "Medium",
    dueDate: "Today",
    completed: false,
    assignedTo: "Robert Chen",
    description: "Annual calibration of seed drills and check of hydraulic fluids on tractor fleet. Critical path item to guarantee planting accuracy."
  },
  {
    id: "task-4",
    farmId: 8,
    farmName: "Pine Acres",
    title: "Staff training due",
    priority: "Low",
    dueDate: "Today",
    completed: false,
    assignedTo: "Amara Kante",
    description: "Conduct mandatory seasonal pesticide handling safety and PPE training for three new field associates joining the harvest team."
  },
  {
    id: "task-5",
    farmId: 1,
    farmName: "Sunrise Farm",
    title: "Fence repair needed",
    priority: "Low",
    dueDate: "Today",
    completed: false,
    assignedTo: "Sarah Jenkins",
    description: "Repair a 4-meter section of the western perimeter fencing damaged by wildlife to prevent local deer from grazing on seedlings."
  }
];

export const initialTrends: TrendMetric[] = [
  {
    id: "trend-production",
    name: "Production",
    value: "+12%",
    subtext: "vs yesterday",
    sparklineData: [45, 52, 49, 63, 58, 70, 78],
    isPositive: true,
    type: "increase"
  },
  {
    id: "trend-revenue",
    name: "Revenue",
    value: "+8%",
    subtext: "vs yesterday",
    sparklineData: [60, 62, 58, 65, 72, 70, 76],
    isPositive: true,
    type: "increase"
  },
  {
    id: "trend-water",
    name: "Water Usage",
    value: "-5%",
    subtext: "vs yesterday",
    sparklineData: [85, 80, 82, 75, 78, 70, 68],
    isPositive: true,
    type: "decrease"
  },
  {
    id: "trend-healthy",
    name: "Healthy Farms",
    value: "3 / 8",
    subtext: "vs yesterday",
    sparklineData: [7, 7, 6, 5, 4, 3, 3],
    isPositive: false, 
    type: "decrease"
  }
];
