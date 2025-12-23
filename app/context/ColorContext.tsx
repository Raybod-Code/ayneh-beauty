"use client";

import { createContext, useContext, useState } from "react";
import { Season } from "@/app/utils/colorAnalysis";

interface ColorContextType {
  season: Season;
  setSeason: (season: Season) => void;
}

const ColorContext = createContext<ColorContextType>({
  season: null,
  setSeason: () => {},
});

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [season, setSeason] = useState<Season>(null);

  return (
    <ColorContext.Provider value={{ season, setSeason }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColor = () => useContext(ColorContext);