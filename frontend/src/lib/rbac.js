// Route access matrix per role.
export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", path: "/app/dashboard", icon: "LayoutDashboard", roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
  { key: "vehicles", label: "Vehicles", path: "/app/vehicles", icon: "Truck", roles: ["FLEET_MANAGER", "DRIVER", "FINANCIAL_ANALYST"] },
  { key: "drivers", label: "Drivers", path: "/app/drivers", icon: "Users", roles: ["FLEET_MANAGER", "SAFETY_OFFICER"] },
  { key: "trips", label: "Trips", path: "/app/trips", icon: "Route", roles: ["FLEET_MANAGER", "DRIVER"] },
  { key: "maintenance", label: "Maintenance", path: "/app/maintenance", icon: "Wrench", roles: ["FLEET_MANAGER"] },
  { key: "expenses", label: "Fuel & Expenses", path: "/app/expenses", icon: "Fuel", roles: ["FLEET_MANAGER", "DRIVER", "FINANCIAL_ANALYST"] },
  { key: "reports", label: "Reports", path: "/app/reports", icon: "BarChart3", roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST"] },
];

export const canAccess = (role, path) => {
  const item = NAV_ITEMS.find((n) => n.path === path);
  return item ? item.roles.includes(role) : false;
};

export const defaultRouteFor = (role) => {
  const first = NAV_ITEMS.find((n) => n.roles.includes(role));
  return first ? first.path : "/app/dashboard";
};
