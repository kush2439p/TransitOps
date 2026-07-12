import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  seedVehicles,
  seedDrivers,
  seedTrips,
  seedMaintenance,
  seedFuelLogs,
  seedExpenses,
} from "./mockData";
import { authApi, setToken, clearToken, getToken } from "./api";

const LS_KEY = "transitops.state.v1";
const AUTH_KEY = "transitops.auth.v1";

const ROLE_AVATARS = {
  FLEET_MANAGER: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?crop=entropy&cs=srgb&fm=jpg&w=200",
  DRIVER: "https://images.unsplash.com/photo-1626712211690-8de4fe30177c?crop=entropy&cs=srgb&fm=jpg&w=200",
  SAFETY_OFFICER: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&w=200",
  FINANCIAL_ANALYST: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=srgb&fm=jpg&w=200",
  ADMIN: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?crop=entropy&cs=srgb&fm=jpg&w=200",
};
const decorate = (u) => (u ? { ...u, avatar: u.avatar || ROLE_AVATARS[u.role] } : null);

const initialState = {
  vehicles: seedVehicles,
  drivers: seedDrivers,
  trips: seedTrips,
  maintenance: seedMaintenance,
  fuelLogs: seedFuelLogs,
  expenses: seedExpenses,
};

const StoreContext = createContext(null);

const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...JSON.parse(raw) };
  } catch {
    return initialState;
  }
};

const loadAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const [user, setUser] = useState(loadAuth);
  // If we have a JWT but no cached user, we're about to restore session — hold rendering
  const [authLoading, setAuthLoading] = useState(() => !!getToken() && !loadAuth());

  // On mount: refresh user via /me if we have a token but no cached user
  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      setAuthLoading(true);
      authApi
        .me()
        .then((u) => setUser(decorate(u)))
        .catch(() => {
          clearToken();
          setUser(null);
        })
        .finally(() => setAuthLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  const login = useCallback(async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      setToken(res.token);
      const u = decorate(res.user);
      setUser(u);
      return u;
    } catch (err) {
      return null;
    }
  }, []);

  const signup = useCallback(async (name, email, password, role = "DRIVER") => {
    try {
      await authApi.signup({ name, email, password, role });
      const res = await authApi.login(email, password);
      setToken(res.token);
      const u = decorate(res.user);
      setUser(u);
      return { ok: true, user: u };
    } catch (err) {
      const msg =
        err.response?.data?.details?.[0] ||
        err.response?.data?.message ||
        "Signup failed";
      return { ok: false, error: msg };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const resetData = useCallback(() => setState(initialState), []);

  // ---- Vehicles ----
  const addVehicle = (v) =>
    setState((s) => ({
      ...s,
      vehicles: [{ id: uid("v"), status: "AVAILABLE", odometer: 0, ...v }, ...s.vehicles],
    }));
  const updateVehicle = (id, patch) =>
    setState((s) => ({
      ...s,
      vehicles: s.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }));

  // ---- Drivers ----
  const addDriver = (d) =>
    setState((s) => ({
      ...s,
      drivers: [{ id: uid("d"), status: "AVAILABLE", safetyScore: 85, ...d }, ...s.drivers],
    }));
  const updateDriver = (id, patch) =>
    setState((s) => ({
      ...s,
      drivers: s.drivers.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));

  // ---- Trips ----
  const createTrip = (t) =>
    setState((s) => ({
      ...s,
      trips: [
        { id: uid("t"), status: "DRAFT", createdAt: new Date().toISOString(), finalOdometer: null, fuelConsumed: null, ...t },
        ...s.trips,
      ],
    }));

  const dispatchTrip = (tripId) =>
    setState((s) => {
      const trip = s.trips.find((x) => x.id === tripId);
      if (!trip) return s;
      return {
        ...s,
        trips: s.trips.map((x) => (x.id === tripId ? { ...x, status: "DISPATCHED" } : x)),
        vehicles: s.vehicles.map((v) => (v.id === trip.vehicleId ? { ...v, status: "ON_TRIP" } : v)),
        drivers: s.drivers.map((d) => (d.id === trip.driverId ? { ...d, status: "ON_DUTY" } : d)),
      };
    });

  const completeTrip = (tripId, finalOdometer, fuelConsumed) =>
    setState((s) => {
      const trip = s.trips.find((x) => x.id === tripId);
      if (!trip) return s;
      const fuelCost = Math.round(fuelConsumed * 1.2);
      return {
        ...s,
        trips: s.trips.map((x) =>
          x.id === tripId ? { ...x, status: "COMPLETED", finalOdometer, fuelConsumed } : x,
        ),
        vehicles: s.vehicles.map((v) =>
          v.id === trip.vehicleId ? { ...v, status: "AVAILABLE", odometer: finalOdometer } : v,
        ),
        drivers: s.drivers.map((d) =>
          d.id === trip.driverId ? { ...d, status: "AVAILABLE" } : d,
        ),
        fuelLogs: [
          { id: uid("f"), vehicleId: trip.vehicleId, liters: fuelConsumed, cost: fuelCost, date: new Date().toISOString() },
          ...s.fuelLogs,
        ],
      };
    });

  const cancelTrip = (tripId) =>
    setState((s) => {
      const trip = s.trips.find((x) => x.id === tripId);
      if (!trip) return s;
      const shouldRelease = trip.status === "DISPATCHED";
      return {
        ...s,
        trips: s.trips.map((x) => (x.id === tripId ? { ...x, status: "CANCELLED" } : x)),
        vehicles: shouldRelease
          ? s.vehicles.map((v) => (v.id === trip.vehicleId ? { ...v, status: "AVAILABLE" } : v))
          : s.vehicles,
        drivers: shouldRelease
          ? s.drivers.map((d) => (d.id === trip.driverId ? { ...d, status: "AVAILABLE" } : d))
          : s.drivers,
      };
    });

  // ---- Maintenance ----
  const createMaintenance = (m) =>
    setState((s) => {
      const isRetired = s.vehicles.find((v) => v.id === m.vehicleId)?.status === "RETIRED";
      return {
        ...s,
        maintenance: [
          { id: uid("m"), status: "ACTIVE", createdAt: new Date().toISOString(), ...m },
          ...s.maintenance,
        ],
        vehicles: isRetired
          ? s.vehicles
          : s.vehicles.map((v) => (v.id === m.vehicleId ? { ...v, status: "MAINTENANCE" } : v)),
        expenses: m.estimatedCost
          ? [
              { id: uid("e"), vehicleId: m.vehicleId, type: "MAINTENANCE", cost: Number(m.estimatedCost), date: new Date().toISOString(), note: m.issue },
              ...s.expenses,
            ]
          : s.expenses,
      };
    });

  const closeMaintenance = (mId) =>
    setState((s) => {
      const rec = s.maintenance.find((x) => x.id === mId);
      if (!rec) return s;
      return {
        ...s,
        maintenance: s.maintenance.map((x) => (x.id === mId ? { ...x, status: "CLOSED" } : x)),
        vehicles: s.vehicles.map((v) =>
          v.id === rec.vehicleId && v.status !== "RETIRED" ? { ...v, status: "AVAILABLE" } : v,
        ),
      };
    });

  // ---- Fuel & Expenses ----
  const addFuelLog = (f) =>
    setState((s) => ({
      ...s,
      fuelLogs: [{ id: uid("f"), date: new Date().toISOString(), ...f }, ...s.fuelLogs],
    }));
  const addExpense = (e) =>
    setState((s) => ({
      ...s,
      expenses: [{ id: uid("e"), date: new Date().toISOString(), ...e }, ...s.expenses],
    }));

  const value = {
    ...state,
    user,
    authLoading,
    login,
    signup,
    logout,
    resetData,
    addVehicle,
    updateVehicle,
    addDriver,
    updateDriver,
    createTrip,
    dispatchTrip,
    completeTrip,
    cancelTrip,
    createMaintenance,
    closeMaintenance,
    addFuelLog,
    addExpense,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
};
