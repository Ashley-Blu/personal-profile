// src/hooks/useMetrics.ts
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

type MetricType = {
  units: "metric" | "imperial";
  temperature: "C" | "F";
  wind: "m/s" | "m/h";
};

type MetricsContextType = {
  metrics: MetricType;
  toggleMetric: () => void;
};

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const METRIC = "metric";

const metric: MetricType = {
  units: "metric",
  temperature: "C",
  wind: "m/s",
};

const imperial: MetricType = {
  units: "imperial",
  temperature: "F",
  wind: "m/h",
};

interface MetricsProviderProps {
  children: ReactNode;
}

export function MetricsProvider({ children }: MetricsProviderProps) {
  const [metrics, setMetrics] = useState<MetricType>(metric);

  useEffect(() => {
    const storedMetric = localStorage.getItem(METRIC);
    if (storedMetric === "imperial") {
      setMetrics(imperial);
    } else {
      setMetrics(metric);
    }
  }, []);

  const toggleMetric = () => {
    setMetrics((currentMetric) => {
      const newMetric =
        currentMetric.units === "metric" ? imperial : metric;
      localStorage.setItem(METRIC, newMetric.units);
      return newMetric;
    });
  };

  return (
    <MetricsContext.Provider value={{ metrics, toggleMetric }}>
      {children}
    </MetricsContext.Provider>
  );
}

export const useMetrics = (): MetricsContextType => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error("useMetrics must be used within a MetricsProvider");
  }
  return context;
};