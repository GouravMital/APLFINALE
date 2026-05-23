export interface Gate {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  maxFlowRate: number;
  status: "OPEN" | "CLOSED" | "BOTTLENECK" | "REROUTING";
  currentFlowLoad?: number;
}

export interface Stand {
  name: string;
  capacity: number;
  centerAngle: number; // angle in degrees
  distance: number; // distance from center of pitch
}

export interface Dimensions {
  width: number;
  length: number;
  height: number;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  capacity: number;
  dimensions: Dimensions;
  gates: Gate[];
  stands: Stand[];
  safetyThreatThreshold: number;
}

export interface SimulationThreat {
  id: string;
  label: string;
  description: string;
  affectedGateId?: string;
  affectedStandName?: string;
}

export interface AgentLogs {
  timestamp: string;
  agent: "Librarian" | "Sentinel" | "Strategist" | "Executor";
  message: string;
  status: "success" | "warning" | "error" | "info";
  trace?: string;
}
