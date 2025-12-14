"use client";

import { createContext, useContext, useState } from "react";

const ShiftContext = createContext(null);

export function ShiftProvider({ children }) {
  const [editShiftId, setEditShiftId] = useState(null);

  return (
    <ShiftContext.Provider value={{ editShiftId, setEditShiftId }}>
      {children}
    </ShiftContext.Provider>
  );
}

export function useShiftContext() {
  return useContext(ShiftContext);
}