import React, { useEffect, useRef, useState } from "react";
import { Stadium, Gate } from "../types";
import { Shield, ZoomIn, ZoomOut, Info, Settings, Compass, MapPin, Video, AlertTriangle, CheckCircle2, Zap } from "lucide-react";

interface VisualizerProps {
  stadium: Stadium;
  activeThreat: string | null;
  disabledGates: string[];
  routingAdjustments: Record<string, string>;
  mitigationActive: boolean;
  fanEvacuationProgress: number; // 0 to 100
  setEvacuationProgress: React.Dispatch<React.SetStateAction<number>>;
  agentSpeedModifier: number; // 0.5 (slow), 1.0 (normal), 1.2 (fast)
  groupSize: number; // 1 (individual) to 10 (large groups)
  crowdDensity: "low" | "medium" | "high";
  simulationSpeed: number;
  stadiumTheme?: any;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  standIndex: number;
  targetGateId: string;
  speed: number;
  angle: number;
  color: string;
  state: "SEATED" | "FLOWING" | "CONGESTED" | "SAVED";
  size: number;
  mitigationSpeedBonus: number;
  groupId: number;
  offsetDirX: number;
  offsetDirY: number;
}

export default function ThreeJS_Visualizer({
  stadium,
  activeThreat,
  disabledGates,
  routingAdjustments,
  mitigationActive,
  fanEvacuationProgress,
  setEvacuationProgress,
  agentSpeedModifier,
  groupSize,
  crowdDensity,
  simulationSpeed,
  stadiumTheme
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isWankhede = stadium.id === "wankhede";
  
  // Tactical camera orientation parameters
  const [rotation, setRotation] = useState<number>(-40); // Yaw degrees
  const [tilt, setTilt] = useState<number>(42); // Pitch degrees
  const [zoom, setZoom] = useState<number>(1.25);
  const [showDetailedEgress, setShowDetailedEgress] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Immersive interactive features state variables
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [hoveredEntity, setHoveredEntity] = useState<{
    id: string;
    name: string;
    type: "gate" | "stand";
    screenX: number;
    screenY: number;
    stats: any;
  } | null>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);

  // Deployed Resources interactive states
  const [highCongestionSectorNames, setHighCongestionSectorNames] = useState<string[]>([]);
  const [resources, setResources] = useState<any[]>([
    { id: "SEC-ALPHA", type: "security", name: "Security Team Alpha", standIndex: 0, status: "PATROLLING", personnelCount: 12, contactFreq: "154.2 MHz", batteryLevel: 94 },
    { id: "SEC-BRAVO", type: "security", name: "Security Team Bravo", standIndex: 1, status: "PATROLLING", personnelCount: 15, contactFreq: "154.6 MHz", batteryLevel: 88 },
    { id: "SEC-CHARLIE", type: "security", name: "Security Team Charlie", standIndex: 2, status: "PATROLLING", personnelCount: 10, contactFreq: "154.9 MHz", batteryLevel: 92 },
    { id: "MED-ALPHA", type: "medical", name: "Medical Responder A", standIndex: 3, status: "PATROLLING", personnelCount: 6, contactFreq: "158.1 MHz", batteryLevel: 95 },
    { id: "MED-BRAVO", type: "medical", name: "Medical Mobile Unit B", standIndex: 2, status: "PATROLLING", personnelCount: 8, contactFreq: "158.3 MHz", batteryLevel: 91 }
  ]);

  const lastStateUpdateRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  // Mouse & Touch interaction state for dragging the 3D projection
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    if (autoRotate) setAutoRotate(false); // Stop auto rotate upon interaction
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      
      // Update yaw (rotation) based on dynamic sideways movement
      setRotation(prev => (prev + deltaX * 0.6) % 360);
      // Update pitch (tilt) based on vertical movement, clamped to avoid fully flipping upside down
      setTilt(prev => Math.max(10, Math.min(85, prev - deltaY * 0.5)));
      
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Record clean hovered cursor coordinates
      mousePosRef.current = { x: mx, y: my };
    }
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    mousePosRef.current = { x: -1000, y: -1000 };
    setHoveredEntity(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // Zoom sensitivity multiplier
    setZoom(prev => Math.max(0.4, Math.min(2.5, prev - e.deltaY * 0.0015)));
  };

  // Support responsive mobile touch interaction as well!
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (autoRotate) setAutoRotate(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;
    
    setRotation(prev => (prev + deltaX * 0.8) % 360);
    setTilt(prev => Math.max(10, Math.min(85, prev - deltaY * 0.6)));
    
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  // High-performance incident reporting video/snapshot exporter
  const handleExportVideo = () => {
    setIsRecording(true);
    setRecordingProgress(0);

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsRecording(false);
      return;
    }

    let recorder: any = null;
    const chunks: Blob[] = [];

    try {
      // captureStream with standard WebRTC frames fallback
      const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (stream && typeof MediaRecorder !== "undefined") {
        recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        recorder.ondataavailable = (e: any) => {
          if (e.data && e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `sentinel_${stadium.id}_incident_simulation_report.webm`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        };
        recorder.start();
      }
    } catch (err) {
      console.warn("MediaRecorder is not supported or was blocked by strict browser iframe sandbox permissions. Utilizing standard frame snapshot output.", err);
    }

    let elapsed = 0;
    const duration = 5000; // Exact 5-second capture limit
    const interval = setInterval(() => {
      elapsed += 100;
      setRecordingProgress(elapsed / duration);

      if (elapsed >= duration) {
        clearInterval(interval);
        if (recorder && recorder.state !== "inactive") {
          recorder.stop();
        } else {
          // Standard pixel stream baseline download fallback
          try {
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `sentinel_${stadium.id}_crisis_report_snapshot.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (e) {
            console.error("Canvas pixel read error:", e);
          }
        }
        setIsRecording(false);
      }
    }, 100);
  };
  
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const prevStadiumIdRef = useRef<string>(stadium.id);
  const prevHoveredIdRef = useRef<string | null>(null);
  const mitigationStartTimeRef = useRef<number | null>(null);
  const lastPhysicsTickRef = useRef<number>(0);

  // Home team mapping to subtle stadium backgrounds with robust fallback mapping
  const getHomeTeamColors = (stadiumId: string) => {
    if (stadiumTheme?.canvasBgStart && stadiumTheme?.canvasBgEnd) {
      return { start: stadiumTheme.canvasBgStart, end: stadiumTheme.canvasBgEnd };
    }
    const cleanId = (stadiumId || "").trim().toLowerCase();
    switch (cleanId) {
      case "wankhede": // Mumbai Indians
        return { start: "rgba(10, 34, 94, 0.45)", end: "rgba(3, 8, 25, 1)" };
      case "eden_gardens": // Kolkata Knight Riders
        return { start: "rgba(58, 13, 92, 0.5)", end: "rgba(12, 3, 22, 1)" };
      case "chepauk": // Chennai Super Kings
      case "chidambaram":
        return { start: "rgba(105, 85, 5, 0.35)", end: "rgba(15, 12, 1, 1)" };
      case "chinnaswamy": // Royal Challengers Bengaluru
        return { start: "rgba(95, 10, 10, 0.35)", end: "rgba(15, 2, 2, 1)" };
      case "narendra_modi": // Gujarat Titans
        return { start: "rgba(11, 26, 56, 0.45)", end: "rgba(4, 8, 20, 1)" };
      case "dharamshala": // Punjab Kings
      case "hpca_dharamshala":
        return { start: "rgba(95, 10, 10, 0.35)", end: "rgba(15, 2, 2, 1)" };
      case "feroz_shah_kotla": // Delhi Capitals
      case "arun_jaitley":
        return { start: "rgba(10, 36, 85, 0.45)", end: "rgba(2, 8, 25, 1)" };
      case "rajiv_gandhi": // Sunrisers Hyderabad
        return { start: "rgba(95, 35, 5, 0.45)", end: "rgba(18, 6, 1, 1)" };
      case "ekana": // Lucknow Super Giants
      case "ekana_sports_city":
        return { start: "rgba(12, 45, 75, 0.45)", end: "rgba(3, 12, 22, 1)" };
      case "pca_bindra":
        return { start: "rgba(95, 10, 10, 0.35)", end: "rgba(15, 2, 2, 1)" };
      case "sawai_mansingh": // Rajasthan Royals
        return { start: "rgba(105, 15, 60, 0.45)", end: "rgba(20, 2, 12, 1)" };
      default:
        return { start: "rgba(15, 23, 42, 0.45)", end: "rgba(2, 6, 23, 1)" };
    }
  };

  // Synchronise resources with active threats or high congestion sectors
  useEffect(() => {
    let affectedIdx = -1;
    if (activeThreat) {
      affectedIdx = stadium.stands.findIndex(stand => {
        const sLower = stand.name.toLowerCase();
        const tLower = activeThreat.toLowerCase();
        return tLower.includes(sLower.split(" ")[0]);
      });
    }

    setResources(prev => prev.map(res => {
      if (affectedIdx !== -1) {
        // Under active threat, dispatch appropriate units to help with crowd control/trauma care!
        if (res.type === "security" && (res.id === "SEC-ALPHA" || res.id === "SEC-BRAVO")) {
          return { ...res, standIndex: affectedIdx, status: "ON_SITE", currentRole: "Crowd Control Gate Bypassing" };
        }
        if (res.type === "medical" && res.id === "MED-ALPHA") {
          return { ...res, standIndex: affectedIdx, status: "TREAT_ACTIVE", currentRole: "Emergency Evacuation Care" };
        }
      } else {
        // Return to standard patrolling distribution
        const defaultIndex = res.id === "SEC-ALPHA" ? 0 
                           : res.id === "SEC-BRAVO" ? 1 
                           : res.id === "SEC-CHARLIE" ? 2 
                           : res.id === "MED-ALPHA" ? 3 
                           : 2;
        return {
          ...res,
          standIndex: defaultIndex % stadium.stands.length,
          status: "PATROLLING",
          currentRole: res.type === "security" ? "Perimeter Patrol" : "Standing Medical Depot"
        };
      }
      return res;
    }));
  }, [activeThreat, stadium]);

  // Initialize and assign groups to fan particles
  useEffect(() => {
    const isNewStadium = prevStadiumIdRef.current !== stadium.id;
    prevStadiumIdRef.current = stadium.id;

    if (isNewStadium || particlesRef.current.length === 0 || !activeThreat) {
      const pCount = 380;
      const temp: Particle[] = [];
      
      for (let i = 0; i < pCount; i++) {
        const standIndex = i % stadium.stands.length;
        const stand = stadium.stands[standIndex];
        
        // Spread fans geometrically around the arc of the stadium stands
        const angleSpread = 50 * (Math.random() - 0.5);
        const angleRad = ((stand.centerAngle + angleSpread) * Math.PI) / 180;
        
        // Distribute between upper and lower bowls representation
        const isUpperBowl = i % 2 === 0;
        const baseDistance = stand.distance;
        const radDist = isUpperBowl 
          ? baseDistance * (1.05 + Math.random() * 0.15) // Upper bowl
          : baseDistance * (0.8 + Math.random() * 0.18); // Lower bowl
        
        const x = Math.cos(angleRad) * radDist;
        const y = Math.sin(angleRad) * radDist;
        // Upper bowl seating is elevated hierarchy, lower bowl is close to concourses
        const z = isUpperBowl ? 14 + Math.random() * 8 : 4 + Math.random() * 6;

        // Group assignment index
        const groupId = Math.floor(i / groupSize);

        // Find initial nearest gate for starting egress
        let targetGateId = "";
        let minDist = Infinity;
        stadium.gates.forEach(g => {
          const dx = g.x - x;
          const dy = g.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            targetGateId = g.id;
          }
        });

        // Group clustering offsets to maintain team integrity
        const angleOffset = Math.random() * Math.PI * 2;
        const offsetDirX = Math.cos(angleOffset) * (1.5 + Math.random() * 2);
        const offsetDirY = Math.sin(angleOffset) * (1.5 + Math.random() * 2);

        temp.push({
          id: i,
          x,
          y,
          z,
          standIndex,
          targetGateId,
          // Basal walk rates scaled by standard velocity distribution
          speed: (0.16 + Math.random() * 0.22),
          angle: angleRad,
          color: "rgba(34, 197, 94, 0.85)", // Clean Green starts
          state: activeThreat ? "FLOWING" : "SEATED",
          size: 1.5 + Math.random() * 1.5,
          mitigationSpeedBonus: 1.0,
          groupId,
          offsetDirX,
          offsetDirY
        });
      }
      particlesRef.current = temp;
      if (!activeThreat) {
        setEvacuationProgress(0);
      }
    }
  }, [stadium, activeThreat, groupSize, setEvacuationProgress]);

  // Resize particle arrays in-place to fit Crowd Density changes without resetting coordinates
  useEffect(() => {
    let targetCount = 380;
    if (crowdDensity === "low") targetCount = 150;
    else if (crowdDensity === "high") targetCount = 750;

    const currentCount = particlesRef.current.length;
    if (currentCount === 0) return; // Wait for initial setup

    if (currentCount < targetCount) {
      // Append new particles organically on empty seats
      const newParticles: Particle[] = [];
      const countToCreate = targetCount - currentCount;
      const startId = currentCount;

      for (let i = 0; i < countToCreate; i++) {
        const id = startId + i;
        const standIndex = id % stadium.stands.length;
        const stand = stadium.stands[standIndex];
        
        const angleSpread = 50 * (Math.random() - 0.5);
        const angleRad = ((stand.centerAngle + angleSpread) * Math.PI) / 180;
        
        const isUpperBowl = id % 2 === 0;
        const baseDistance = stand.distance;
        const radDist = isUpperBowl 
          ? baseDistance * (1.05 + Math.random() * 0.15)
          : baseDistance * (0.8 + Math.random() * 0.18);
        
        const x = Math.cos(angleRad) * radDist;
        const y = Math.sin(angleRad) * radDist;
        const z = isUpperBowl ? 14 + Math.random() * 8 : 4 + Math.random() * 6;
        const groupId = Math.floor(id / groupSize);

        let targetGateId = "";
        let minDist = Infinity;
        stadium.gates.forEach(g => {
          const dx = g.x - x;
          const dy = g.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            targetGateId = g.id;
          }
        });

        const angleOffset = Math.random() * Math.PI * 2;
        const offsetDirX = Math.cos(angleOffset) * (1.5 + Math.random() * 2);
        const offsetDirY = Math.sin(angleOffset) * (1.5 + Math.random() * 2);

        newParticles.push({
          id,
          x,
          y,
          z,
          standIndex,
          targetGateId,
          speed: (0.16 + Math.random() * 0.22),
          angle: angleRad,
          color: activeThreat ? "rgba(244, 63, 94, 0.85)" : "rgba(34, 197, 94, 0.85)",
          state: activeThreat ? "FLOWING" : "SEATED",
          size: 1.5 + Math.random() * 1.5,
          mitigationSpeedBonus: 1.0,
          groupId,
          offsetDirX,
          offsetDirY
        });
      }
      particlesRef.current = [...particlesRef.current, ...newParticles];
    } else if (currentCount > targetCount) {
      // Shave down slice to avoid overflowing memory
      particlesRef.current = particlesRef.current.slice(0, targetCount);
    }
  }, [crowdDensity, stadium, groupSize, activeThreat]);

  // Adjust safety colors and transition states depending on active alerts/strategies
  useEffect(() => {
    if (activeThreat) {
      if (mitigationActive) {
        mitigationStartTimeRef.current = Date.now();
      } else {
        mitigationStartTimeRef.current = null;
        particlesRef.current.forEach(p => {
          p.state = "FLOWING";
          if (disabledGates.includes(p.targetGateId)) {
            p.state = "CONGESTED";
            p.color = "rgba(239, 68, 68, 0.9)"; // Crimson bottleneck state
          }
        });
      }
    } else {
      mitigationStartTimeRef.current = null;
      particlesRef.current.forEach(p => {
        p.state = "SEATED";
        p.color = "rgba(34, 197, 94, 0.75)";
      });
    }
  }, [activeThreat, disabledGates, mitigationActive]);

  // Unified Frame Loop - Isometric 3D Rendering and Multi-Agent Crowd Physics Simulation
  useEffect(() => {
    const handleFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      if (autoRotate) {
        setRotation(prev => (prev + 0.08) % 360);
      }

      // Check consensus mitigation elapsed time
      let elapsedMs = 0;
      if (mitigationStartTimeRef.current !== null) {
        elapsedMs = Date.now() - mitigationStartTimeRef.current;
      }

      const now = Date.now();
      const shouldUpdatePhysics = !simulationSpeed || (now - lastPhysicsTickRef.current >= simulationSpeed);

      if (shouldUpdatePhysics) {
        lastPhysicsTickRef.current = now;

        // 1. Calculate Group Congestion Indices (Social Physics)
        // If any fan in a group is stuck/congested, the whole group slows down to seek solidarity
        const groupCongestedRef: Record<number, boolean> = {};
        particlesRef.current.forEach(p => {
          if (p.state === "CONGESTED") {
            groupCongestedRef[p.groupId] = true;
          }
        });

        // 2. Pre-calculate Group Centroids (Social Cohesion)
        const groupSumX: Record<number, number> = {};
        const groupSumY: Record<number, number> = {};
        const groupCount: Record<number, number> = {};
        
        particlesRef.current.forEach(p => {
          if (p.state !== "SAVED") {
            groupSumX[p.groupId] = (groupSumX[p.groupId] || 0) + p.x;
            groupSumY[p.groupId] = (groupSumY[p.groupId] || 0) + p.y;
            groupCount[p.groupId] = (groupCount[p.groupId] || 0) + 1;
          }
        });

        // Update particle kinematics
        particlesRef.current.forEach(p => {
          if (p.state === "SAVED") {
            // Keep walking outward for dispersing crowd visualization, so they stay visible!
            p.x += p.offsetDirX * 0.15 * agentSpeedModifier;
            p.y += p.offsetDirY * 0.15 * agentSpeedModifier;
            if (p.z > 0.1) p.z -= 0.12 * agentSpeedModifier;
            
            // Gradual shrink scale
            p.size = Math.max(0.1, p.size - 0.007 * agentSpeedModifier);
            
            // Render saving particles with a safe bright emerald green dispersing trail!
            p.color = `rgba(16, 185, 129, ${Math.max(0.08, p.size / 3)})`;
            return;
          }

          if (activeThreat) {
            p.state = "FLOWING";
            let activeTargetId = p.targetGateId;

            if (mitigationActive) {
              // Recalculate routing based on agent balancing algorithms
              if (routingAdjustments[p.targetGateId]) {
                activeTargetId = routingAdjustments[p.targetGateId];
              }

              // Rapid 3-second green safety transition ("Happy Path" compliant)
              if (elapsedMs > 0) {
                const transProgress = Math.min(1.0, elapsedMs / 3000); // Transitions to 100% in exactly 3 seconds
                p.mitigationSpeedBonus = 1.0 + transProgress * 3.5;

                if (transProgress >= 1) {
                  p.color = "rgba(16, 185, 129, 0.95)"; // Absolute Safe Green
                } else {
                  // Smooth interpolation from warning red back to safe green
                  const redVal = Math.floor(239 - (239 - 16) * transProgress);
                  const greenVal = Math.floor(68 + (185 - 68) * transProgress);
                  const blueVal = Math.floor(68 + (129 - 68) * transProgress);
                  p.color = `rgba(${redVal}, ${greenVal}, ${blueVal}, 0.9)`;
                }
              }
            } else {
              // No mitigation active - bottlenecked fans turn alert red
              if (disabledGates.includes(p.targetGateId)) {
                p.state = "CONGESTED";
                p.color = "rgba(239, 68, 68, 0.95)";
              }
            }

            const targetGate = stadium.gates.find(g => g.id === activeTargetId);
            if (targetGate) {
              const dx = targetGate.x - p.x;
              const dy = targetGate.y - p.y;
              const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

              if (distanceToTarget < 5) {
                // Instead of disappearing, mark as SAVED and assign dynamic outward velocity!
                p.state = "SAVED";
                const angle = Math.atan2(p.y, p.x);
                p.offsetDirX = Math.cos(angle) * (1.2 + Math.random() * 0.8);
                p.offsetDirY = Math.sin(angle) * (1.2 + Math.random() * 0.8);
              } else {
                // Standard pacing formula incorporating speed modifier and group solidarity slows
                const standardSpeed = p.speed * agentSpeedModifier;
                const solidaritySlowdown = groupCongestedRef[p.groupId] ? 0.45 : 1.0;
                let currentVelocity = standardSpeed * solidaritySlowdown;

                if (mitigationActive) {
                  currentVelocity *= p.mitigationSpeedBonus;
                }

                // Base angle towards exit
                let targetAngle = Math.atan2(dy, dx);

                // Inject social physics - cohesive pull toward group centroid (if groupSize > 1)
                if (groupSize > 1 && groupCount[p.groupId] > 1) {
                  const cxGroup = groupSumX[p.groupId] / groupCount[p.groupId];
                  const cyGroup = groupSumY[p.groupId] / groupCount[p.groupId];
                  
                  // Vector pointing toward the group center of mass
                  const dcx = cxGroup - p.x;
                  const dcy = cyGroup - p.y;
                  const distToCenter = Math.sqrt(dcx * dcx + dcy * dcy);
                  
                  if (distToCenter > 3) {
                    // Mellow pull force to keep group from disintegrating
                    const cohesionForce = 0.18;
                    const cohesionAngle = Math.atan2(dcy, dcx);
                    
                    // Blend standard exit vectors with social cohesion pull vectors
                    const vx = Math.cos(targetAngle) * (1 - cohesionForce) + Math.cos(cohesionAngle) * cohesionForce;
                    const vy = Math.sin(targetAngle) * (1 - cohesionForce) + Math.sin(cohesionAngle) * cohesionForce;
                    targetAngle = Math.atan2(vy, vx);
                  }
                }

                // Apply movement steps
                p.angle = targetAngle;
                p.x += Math.cos(p.angle) * currentVelocity;
                p.y += Math.sin(p.angle) * currentVelocity;

                // Gradually scale descent elevation to represent concourse stairs descent
                if (p.z > 1.0) {
                  p.z -= 0.06 * agentSpeedModifier;
                }
              }
            }
          } else {
            // Relaxed standby oscillation while fans are seated
            p.x += (Math.random() - 0.5) * 0.03;
            p.y += (Math.random() - 0.5) * 0.03;
          }
        });

        // Update parent secure status metrics
        let currentSaved = 0;
        particlesRef.current.forEach(p => {
          if (p.state === "SAVED") currentSaved++;
        });
        const totalParticles = particlesRef.current.length;
        if (activeThreat && totalParticles > 0) {
          const pct = Math.round((currentSaved / totalParticles) * 100);
          setEvacuationProgress(pct);
        }

        // High-performance throttling for state update (run every ~1 second)
        const checkNow = Date.now();
        if (checkNow - lastStateUpdateRef.current > 1000) {
          lastStateUpdateRef.current = checkNow;
          const highCongestion: string[] = [];
          stadium.stands.forEach((stand, idx) => {
            const isAffected = activeThreat && standIsAffected(stand.name, activeThreat);
            const fansCount = particlesRef.current.filter(p => p.standIndex === idx && p.state !== "SAVED").length;
            const capacityRatio = fansCount / (stand.capacity * 0.015);
            
            if (isAffected || capacityRatio > 0.65) {
              highCongestion.push(stand.name.split(" ")[0]);
            }
          });

          setHighCongestionSectorNames(prev => {
            const sortedNew = [...highCongestion].sort().join(",");
            const sortedOld = [...prev].sort().join(",");
            if (sortedNew !== sortedOld) {
              return highCongestion;
            }
            return prev;
          });
        }
      }

      // Drawing phase
      // Clear with dynamic radial gradient matching the primary colors of each stadium's home franchise team!
      const colors = getHomeTeamColors(stadium.id);
      const bgGrad = ctx.createRadialGradient(
        width / 2, 
        height / 2, 
        40, 
        width / 2, 
        height / 2, 
        Math.max(width, height) * 0.70
      );
      bgGrad.addColorStop(0, colors.start);
      bgGrad.addColorStop(1, colors.end);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      // Background matrix grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gSize = 40;
      for (let x = 0; x < width; x += gSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const cx = width / 2;
      const cy = height / 2;
      const rotRad = (rotation * Math.PI) / 180;
      const tiltRad = (tilt * Math.PI) / 180;

      // Acoustic and warning camera shakes fully disabled per user specification
      const shakeX = 0;
      const shakeY = 0;

      // Projection engine of 3D vectors to Screen Coordinates
      const project = (px: number, py: number, pz: number) => {
        const rx = px * Math.cos(rotRad) - py * Math.sin(rotRad);
        const ry = px * Math.sin(rotRad) + py * Math.cos(rotRad);
        const sX = rx * zoom;
        const sY = (ry * Math.cos(tiltRad) - pz * Math.sin(tiltRad)) * zoom;
        return {
          x: cx + sX + shakeX,
          y: cy + sY + shakeY,
          depth: ry
        };
      };

      const d = stadium.dimensions;

      // ==========================================
      // DETAILED 3D GEOMETRY SCHEMAS & RENDERERS
      // Unique visualizer features for Wankhede Stadium (also applied elegantly to all)
      // ==========================================
      
      const isWankhede = stadium.id === "wankhede";

      // 1. Draw Seating Bowls (Split into Lower Seating Tier & Upper Seating Tiers and Vomitories)
      // Wankhede stands out with elevated tiers, concourse channels, and glowing vomitory portals
      
      // Drawing Lower & Upper Seating Bowls
      const seatingBowlLevels = isWankhede 
        ? [ { rScale: 0.35, z: 2, label: "Lower Bowl" }, { rScale: 0.45, z: 8, label: "Middle Tier" }, { rScale: 0.55, z: 14, label: "Upper Bowl" } ]
        : [ { rScale: 0.38, z: 3, label: "Lower Tier" }, { rScale: 0.54, z: 12, label: "Upper Tier" } ];

      seatingBowlLevels.forEach((level, lIndex) => {
        // Render 3D elliptical wireframes for the seating bowls
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 + (lIndex * 0.06)})`;
        ctx.lineWidth = 1.5;
        for (let a = 0; a <= 360; a += 6) {
          const rad = (a * Math.PI) / 180;
          const pt = project(Math.cos(rad) * d.length * level.rScale, Math.sin(rad) * d.width * level.rScale, level.z);
          if (a === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.stroke();

        // Draw structural support pillars
        if (lIndex > 0) {
          for (let col = 0; col < 360; col += 60) {
            const radAngle = (col * Math.PI) / 180;
            const ptBase = project(Math.cos(radAngle) * d.length * level.rScale, Math.sin(radAngle) * d.width * level.rScale, 0);
            const ptTop = project(Math.cos(radAngle) * d.length * level.rScale, Math.sin(radAngle) * d.width * level.rScale, level.z);
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
            ctx.lineWidth = 1;
            ctx.moveTo(ptBase.x, ptBase.y);
            ctx.lineTo(ptTop.x, ptTop.y);
            ctx.stroke();
          }
        }

        // Render individual HD plastic bucket seats in 3D wire arcs!
        // This simulates thousands of chairs curved around each seating tier for a true high-definition stadium view
        const seatColor = lIndex === 0 ? "rgba(30, 58, 138, 0.28)" // Mumbai/Indigo Blue lower seats
                        : lIndex === 1 ? "rgba(217, 119, 6, 0.28)" // Gold/VIP middle seats
                        : "rgba(185, 28, 28, 0.28)";               // Alert/Crimson upper tiers
        
        ctx.fillStyle = seatColor;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 0.5;

        // Space seats radially and row-wise
        for (let angle = 0; angle < 360; angle += 15) {
          const rad = (angle * Math.PI) / 180;
          for (let row = 0; row < 3; row++) {
            const rowDistX = d.length * level.rScale * (0.95 + row * 0.035);
            const rowDistY = d.width * level.rScale * (0.95 + row * 0.035);
            const rz = level.z + row * 0.7; // escalate seats on step rows

            const seatPt = project(Math.cos(rad) * rowDistX, Math.sin(rad) * rowDistY, rz);

            // Draw clean 3D isometric bracket representing backrest & cushion
            ctx.beginPath();
            ctx.rect(seatPt.x - 2, seatPt.y - 3, 4, 3); // backrest
            ctx.fill();

            ctx.beginPath();
            ctx.rect(seatPt.x - 2, seatPt.y, 4, 2); // seat cushion
            ctx.stroke();
          }
        }
      });

      // 2. Draw Concourses (Evacuation distribution hallways layout)
      // Concourses surround the seating bowl and funnel fans out to the registered gates
      ctx.beginPath();
      ctx.fillStyle = isWankhede ? "rgba(30, 41, 59, 0.08)" : "rgba(30, 41, 59, 0.04)";
      ctx.strokeStyle = "rgba(99, 102, 241, 0.35)"; // Indigo Accent
      ctx.lineWidth = 2.5;
      const concourseRadX = d.length * 0.62;
      const concourseRadY = d.width * 0.62;
      for (let a = 0; a <= 360; a += 4) {
        const rad = (a * Math.PI) / 180;
        const pt = project(Math.cos(rad) * concourseRadX, Math.sin(rad) * concourseRadY, 0);
        if (a === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Additional inner concourse ring boundary
      ctx.beginPath();
      ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
      ctx.lineWidth = 1;
      for (let a = 0; a <= 360; a += 8) {
        const rad = (a * Math.PI) / 180;
        const pt = project(Math.cos(rad) * concourseRadX * 0.92, Math.sin(rad) * concourseRadY * 0.92, 0);
        if (a === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.stroke();

      // 3. Draw Vomitories (Elevated radial exit passages connecting Seating Bowls directly to Concourses)
      // Wankhede Stadium lists 16 main vomitories connecting stands to the security egress tracks
      const vomitoryCount = isWankhede ? 16 : 10;
      for (let v = 0; v < vomitoryCount; v++) {
        const angleValue = (v / vomitoryCount) * 360;
        const radVal = (angleValue * Math.PI) / 180;
        
        const ptInner = project(Math.cos(radVal) * d.length * 0.38, Math.sin(radVal) * d.width * 0.38, 2);
        const ptOuter = project(Math.cos(radVal) * d.length * 0.57, Math.sin(radVal) * d.width * 0.57, 0);
        
        ctx.beginPath();
        ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
        ctx.lineWidth = 1.5;
        ctx.moveTo(ptInner.x, ptInner.y);
        ctx.lineTo(ptOuter.x, ptOuter.y);
        ctx.stroke();

        // Vomitory portal beacons (little tactical dots inside the seating bowls)
        ctx.beginPath();
        ctx.arc(ptInner.x, ptInner.y, 1.8, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(99, 102, 241, 0.75)";
        ctx.fill();
      }

      // 4. Draw Central Outfield & Pitch Pitch
      ctx.beginPath();
      ctx.fillStyle = "rgba(16, 185, 129, 0.04)";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
      ctx.lineWidth = 1.2;
      const outfieldRadius = d.length * 0.32;
      for (let a = 0; a <= 360; a += 8) {
        const rad = (a * Math.PI) / 180;
        const pt = project(Math.cos(rad) * outfieldRadius, Math.sin(rad) * outfieldRadius, 0);
        if (a === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw Wicket Pitch block
      const pw1 = project(-3, -8, 0);
      const pw2 = project(3, -8, 0);
      const pw3 = project(3, 8, 0);
      const pw4 = project(-3, 8, 0);
      ctx.beginPath();
      ctx.fillStyle = "rgba(120, 113, 108, 0.15)";
      ctx.strokeStyle = "rgba(120, 113, 108, 0.28)";
      ctx.moveTo(pw1.x, pw1.y);
      ctx.lineTo(pw2.x, pw2.y);
      ctx.lineTo(pw3.x, pw3.y);
      ctx.lineTo(pw4.x, pw4.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // ===================================================
      // IMMERSIVE EXPERIMENTAL: 4-CORNER FLOODLIGHT TOWERS
      // ===================================================
      const lightPositions = [
        { x: -d.length * 0.72, y: -d.width * 0.72, z: 22, color: "rgba(255, 255, 255, 0.04)" },
        { x: d.length * 0.72, y: -d.width * 0.72, z: 22, color: "rgba(255, 255, 255, 0.04)" },
        { x: d.length * 0.72, y: d.width * 0.72, z: 22, color: "rgba(255, 255, 255, 0.04)" },
        { x: -d.length * 0.72, y: d.width * 0.72, z: 22, color: "rgba(255, 255, 255, 0.04)" }
      ];

      lightPositions.forEach((pos, idx) => {
        const basePt = project(pos.x, pos.y, 0);
        const topPt = project(pos.x, pos.y, pos.z);

        // Tower structural skeleton
        ctx.beginPath();
        ctx.strokeStyle = "rgba(100, 116, 139, 0.35)";
        ctx.lineWidth = 1.8;
        ctx.moveTo(basePt.x, basePt.y);
        ctx.lineTo(topPt.x, topPt.y);
        ctx.stroke();

        // Cross bracing details
        ctx.beginPath();
        ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
        ctx.lineWidth = 0.8;
        ctx.moveTo(basePt.x - 4, basePt.y);
        ctx.lineTo(topPt.x, topPt.y - 1);
        ctx.moveTo(basePt.x + 4, basePt.y);
        ctx.lineTo(topPt.x, topPt.y - 1);
        ctx.stroke();

        // Shiny projector array
        ctx.beginPath();
        ctx.arc(topPt.x, topPt.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Volumetric glare beams
        ctx.beginPath();
        const beamGrad = ctx.createLinearGradient(topPt.x, topPt.y, basePt.x * 0.5 + idx * 8, basePt.y * 0.5);
        beamGrad.addColorStop(0, "rgba(255, 255, 255, 0.16)");
        beamGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.03)");
        beamGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = beamGrad;
        ctx.moveTo(topPt.x, topPt.y);
        ctx.lineTo(topPt.x - 22, topPt.y + 40);
        ctx.lineTo(topPt.x + 22, topPt.y + 40);
        ctx.closePath();
        ctx.fill();
      });

      // ===================================================
      // STADIUM OUTER SHELL CANOPY & STEEL CORRIDORS
      // ===================================================
      ctx.beginPath();
      ctx.strokeStyle = "rgba(51, 65, 85, 0.45)";
      ctx.lineWidth = 2;
      const shellRadX = d.length * 0.72;
      const shellRadY = d.width * 0.72;
      for (let a = 0; a <= 360; a += 5) {
        const rad = (a * Math.PI) / 180;
        const ptBottom = project(Math.cos(rad) * shellRadX, Math.sin(rad) * shellRadY, 0);
        const ptTop = project(Math.cos(rad) * shellRadX * 1.05, Math.sin(rad) * shellRadY * 1.05, 12);
        
        if (a === 0) ctx.moveTo(ptBottom.x, ptBottom.y);
        else ctx.lineTo(ptBottom.x, ptBottom.y);
        
        // Connect vertical facade beams
        if (a % 30 === 0) {
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = "rgba(51, 65, 85, 0.2)";
          ctx.moveTo(ptBottom.x, ptBottom.y);
          ctx.lineTo(ptTop.x, ptTop.y);
          ctx.stroke();
          ctx.restore();
        }
      }
      ctx.stroke();

      // ===================================================
      // FLOOD-HEAT PLAYER DENSITY THERMAL HEATMAP OVERLAY
      // ===================================================
      if (showHeatmap) {
        const gridResX = 14;
        const gridResY = 14;
        const densityGrid: number[][] = Array(gridResX).fill(0).map(() => Array(gridResY).fill(0));
        const maxCoordX = d.length * 0.72;
        const maxCoordY = d.width * 0.72;

        // Populate crowd density metrics
        particlesRef.current.forEach(p => {
          if (p.state === "SAVED") return;
          // Remap field coordinates to grid indices
          const indexX = Math.floor(((p.x + maxCoordX) / (maxCoordX * 2)) * gridResX);
          const indexY = Math.floor(((p.y + maxCoordY) / (maxCoordY * 2)) * gridResY);
          
          if (indexX >= 0 && indexX < gridResX && indexY >= 0 && indexY < gridResY) {
            densityGrid[indexX][indexY]++;
          }
        });

        // Find density peak for visual ceiling interpolation
        let peakDensity = 1;
        for (let x = 0; x < gridResX; x++) {
          for (let y = 0; y < gridResY; y++) {
            if (densityGrid[x][y] > peakDensity) {
              peakDensity = densityGrid[x][y];
            }
          }
        }

        // Render dynamic thermal cells mapped onto the 3D floor
        for (let x = 0; x < gridResX; x++) {
          for (let y = 0; y < gridResY; y++) {
            const count = densityGrid[x][y];
            if (count > 0) {
              const intensity = count / peakDensity;
              
              // Mapped coordinates back to 3D space
              const rX = -maxCoordX + (x + 0.5) * ((maxCoordX * 2) / gridResX);
              const rY = -maxCoordY + (y + 0.5) * ((maxCoordY * 2) / gridResY);

              const pt = project(rX, rY, 0.4);
              const radius = (d.length * 2.1 / gridResX) * zoom;
              
              const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, radius);
              
              if (intensity < 0.35) {
                // Low crowd density: calm cold blue
                grad.addColorStop(0, `rgba(59, 130, 246, ${0.18 + intensity * 0.2})`);
                grad.addColorStop(1, "rgba(59, 130, 246, 0)");
              } else if (intensity < 0.7) {
                // Medium congestion: caution amber orange
                const ratio = (intensity - 0.35) / 0.35;
                const r = Math.floor(59 + (245 - 59) * ratio);
                const g = Math.floor(130 + (158 - 130) * ratio);
                grad.addColorStop(0, `rgba(${r}, ${g}, 11, ${0.25 + intensity * 0.15})`);
                grad.addColorStop(1, "rgba(245, 158, 11, 0)");
              } else {
                // High risk bottleneck cluster: danger crimson red
                const ratio = (intensity - 0.7) / 0.3;
                grad.addColorStop(0, `rgba(239, 68, 68, ${0.35 + ratio * 0.22})`);
                grad.addColorStop(0.5, `rgba(239, 68, 68, 0.1)`);
                grad.addColorStop(1, "rgba(239, 68, 68, 0)");
              }

              ctx.beginPath();
              ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI);
              ctx.fillStyle = grad;
              ctx.fill();
            }
          }
        }
      }

      // ===================================================
      // INTERACTIVE CODES & GATES HOVER HOOKS DETECTOR
      // ===================================================
      let closestEntity: any = null;
      let minDistance = 35; // Capture tolerance in pixel radius

      // 1. Evaluate closest exit doors
      stadium.gates.forEach(gate => {
        const pt = project(gate.x, gate.y, 0);
        const dx = pt.x - mousePosRef.current.x;
        const dy = pt.y - mousePosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDistance) {
          minDistance = dist;
          const isDisabled = disabledGates.includes(gate.id);
          const flowCount = particlesRef.current.filter(p => p.state === "FLOWING" && (routingAdjustments[p.targetGateId] || p.targetGateId) === gate.id).length;
          const congestedCount = particlesRef.current.filter(p => p.state === "CONGESTED" && (routingAdjustments[p.targetGateId] || p.targetGateId) === gate.id).length;
          
          closestEntity = {
            id: gate.id,
            name: `GATE ${gate.id.toUpperCase()}`,
            type: "gate",
            screenX: pt.x,
            screenY: pt.y,
            stats: {
              status: isDisabled ? "BLOCKED/LOCKED" : (congestedCount > 6 ? "HIGH CONGESTION" : "FLOW CLEAR"),
              flow: flowCount,
              congested: congestedCount,
              rerouted: routingAdjustments[gate.id] && routingAdjustments[gate.id] !== gate.id ? `DIVERTED TO ${routingAdjustments[gate.id]}` : "NONE",
              capacityRate: `${Math.round(((flowCount + congestedCount) / 100) * 100)}%`
            }
          };
        }
      });

      // 2. Evaluate closest stand coordinate blocks
      stadium.stands.forEach(stand => {
        const radCenter = (stand.centerAngle * Math.PI) / 180;
        const standRadius = stand.distance;
        const pt = project(Math.cos(radCenter) * (standRadius * 0.88), Math.sin(radCenter) * (standRadius * 0.88), 6);
        
        const dx = pt.x - mousePosRef.current.x;
        const dy = pt.y - mousePosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDistance) {
          minDistance = dist;
          const isAffected = activeThreat && standIsAffected(stand.name, activeThreat);
          const idx = stadium.stands.indexOf(stand);
          const fansCount = particlesRef.current.filter(p => p.standIndex === idx && p.state !== "SAVED").length;
          const savedFans = particlesRef.current.filter(p => p.standIndex === idx && p.state === "SAVED").length;
          const congestionRatio = fansCount / (stand.capacity * 0.015);
          
          closestEntity = {
            id: stand.name,
            name: `${stand.name.toUpperCase()} SECTOR`,
            type: "stand",
            screenX: pt.x,
            screenY: pt.y,
            stats: {
              status: isAffected ? "HAZARD ACTIVE" : (congestionRatio > 0.72 ? "STRESSED/HIGH PRECS" : "STABLE"),
              activeFans: fansCount,
              savedFans: savedFans,
              standsCap: stand.capacity,
              dangerLevel: isAffected ? "CRITICAL (SENTINEL RED ALERT)" : (congestionRatio > 0.72 ? "WARNING" : "STABLE")
            }
          };
        }
      });

      // Secure single state cascade update
      if (closestEntity) {
        if (prevHoveredIdRef.current !== closestEntity.id) {
          prevHoveredIdRef.current = closestEntity.id;
          setHoveredEntity(closestEntity);
        }
      } else {
        if (prevHoveredIdRef.current !== null) {
          prevHoveredIdRef.current = null;
          setHoveredEntity(null);
        }
      }

      // 5. Draw Stands Sectors
      stadium.stands.forEach(stand => {
        const radCenter = (stand.centerAngle * Math.PI) / 180;
        const spanValue = 42;
        const startR = (stand.centerAngle - spanValue / 2) * Math.PI / 180;
        const endR = (stand.centerAngle + spanValue / 2) * Math.PI / 180;
        const standRadius = stand.distance;

        ctx.beginPath();
        let standColor = "rgba(30, 41, 59, 0.28)";
        let standStroke = "rgba(255, 255, 255, 0.08)";
        if (activeThreat && standIsAffected(stand.name, activeThreat)) {
          standColor = "rgba(239, 68, 68, 0.12)";
          standStroke = "rgba(239, 68, 68, 0.45)";
        }
        ctx.fillStyle = standColor;
        ctx.strokeStyle = standStroke;
        ctx.lineWidth = 1.5;

        const standPts: { x: number, y: number }[] = [];
        const stepsCount = 8;
        for (let j = 0; j <= stepsCount; j++) {
          const a = startR + (endR - startR) * (j / stepsCount);
          const pt = project(Math.cos(a) * standRadius, Math.sin(a) * standRadius, d.height * 0.32);
          standPts.push(pt);
        }
        for (let j = stepsCount; j >= 0; j--) {
          const a = startR + (endR - startR) * (j / stepsCount);
          const pt = project(Math.cos(a) * (standRadius * 0.75), Math.sin(a) * (standRadius * 0.75), 1.5);
          standPts.push(pt);
        }

        if (standPts.length > 0) {
          ctx.moveTo(standPts[0].x, standPts[0].y);
          for (let k = 1; k < standPts.length; k++) {
            ctx.lineTo(standPts[k].x, standPts[k].y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Sector name labels
        const labelPosition = project(Math.cos(radCenter) * (standRadius * 1.05), Math.sin(radCenter) * (standRadius * 1.05), d.height * 0.45);
        ctx.font = "bold 8px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.textAlign = "center";
        ctx.fillText(stand.name.toUpperCase(), labelPosition.x, labelPosition.y);
      });

      // Draw Deployed Resources directly in the 3D layout view
      resources.forEach(res => {
        const stand = stadium.stands[res.standIndex];
        if (!stand) return;
        const radCenter = (stand.centerAngle * Math.PI) / 180;
        const standRadius = stand.distance * 0.84;
        const pt = project(Math.cos(radCenter) * standRadius, Math.sin(radCenter) * standRadius, 4);

        const isDispatched = res.status === "EN_ROUTE" || res.status === "ON_SITE" || res.status === "TREAT_ACTIVE";
        const pulse = (Math.sin(Date.now() / 150) + 1) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isDispatched ? 8 + pulse * 4 : 7, 0, 2 * Math.PI);
        ctx.fillStyle = res.type === "medical" ? "rgba(239, 68, 68, 0.28)" : "rgba(59, 130, 246, 0.28)";
        ctx.strokeStyle = res.type === "medical" ? "#ef4444" : "#3b82f6";
        ctx.lineWidth = isDispatched ? 1.5 : 1;
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 8px 'Inter', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(res.type === "medical" ? "✚" : "🛡️", pt.x, pt.y);

        ctx.font = "bold 6px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fillText(res.id, pt.x, pt.y - 11);
        ctx.restore();
      });

      // 6. Draw Emergency Exits & Escape Corridors (High contrast, blinking dashed vectors)
      // Visual corridors that highlight pathways leading from vomitories directly to the outside
      if (showDetailedEgress && activeThreat) {
        stadium.gates.forEach(gate => {
          const isDisabled = disabledGates.includes(gate.id);
          const solvedDestinationId = routingAdjustments[gate.id] || gate.id;

          if (isDisabled || solvedDestinationId !== gate.id) {
            const srcGate = stadium.gates.find(g => g.id === gate.id);
            const dstGate = stadium.gates.find(g => g.id === solvedDestinationId);
            
            if (srcGate && dstGate && solvedDestinationId !== gate.id) {
              const ptSrc = project(srcGate.x, srcGate.y, 0);
              const ptDst = project(dstGate.x, dstGate.y, 0);

              ctx.save();
              ctx.setLineDash([4, 5]);
              ctx.strokeStyle = "rgba(245, 158, 11, 0.7)"; // Flash alert Orange
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.moveTo(ptSrc.x, ptSrc.y);
              ctx.lineTo(ptDst.x, ptDst.y);
              ctx.stroke();

              // Running beacon pulses along the evacuation direction vector
              const flowStep = (Date.now() % 1200) / 1200;
              const px = ptSrc.x + (ptDst.x - ptSrc.x) * flowStep;
              const py = ptSrc.y + (ptDst.y - ptSrc.y) * flowStep;
              
              ctx.beginPath();
              ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
              ctx.fillStyle = "#f59e0b";
              ctx.fill();
              ctx.restore();
            }
          }
        });

        // Wankhede specific detailed emergency evacuation guidelines
        if (isWankhede) {
          ctx.save();
          ctx.strokeStyle = "rgba(16, 185, 129, 0.35)"; // Safe green corridors
          ctx.setLineDash([5, 8]);
          ctx.lineWidth = 2;
          
          // Draw high priority evacuation pathways bypassing danger points
          stadium.gates.forEach(gate => {
            if (!disabledGates.includes(gate.id)) {
              // Draw safe escape corridor back to stadium limits
              const escapePtIn = project(gate.x * 0.7, gate.y * 0.7, 0);
              const escapePtOut = project(gate.x * 1.25, gate.y * 1.25, 0);
              ctx.beginPath();
              ctx.moveTo(escapePtIn.x, escapePtIn.y);
              ctx.lineTo(escapePtOut.x, escapePtOut.y);
              ctx.stroke();
            }
          });
          ctx.restore();
        }
      }

      // 7. Draw Gate Beacons
      stadium.gates.forEach(gate => {
        const pt = project(gate.x, gate.y, 0);
        const isDisabled = disabledGates.includes(gate.id);
        const hasAlternativeRoute = routingAdjustments[gate.id] && routingAdjustments[gate.id] !== gate.id;

        const glowPulse = (Math.sin(Date.now() / 250) + 1) / 2;

        ctx.beginPath();
        if (isDisabled) {
          ctx.arc(pt.x, pt.y, 5 + glowPulse * 6, 0, 2 * Math.PI);
          ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = "#ef4444";
          ctx.fill();
        } else if (hasAlternativeRoute) {
          ctx.arc(pt.x, pt.y, 6 + glowPulse * 5, 0, 2 * Math.PI);
          ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = "#f59e0b";
          ctx.fill();
        } else {
          ctx.arc(pt.x, pt.y, 5 + glowPulse * 4, 0, 2 * Math.PI);
          ctx.strokeStyle = "rgba(16, 185, 129, 0.28)";
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = "#10b981";
          ctx.fill();
        }

        // Gate titles
        ctx.font = "bold 9px 'JetBrains Mono'";
        ctx.fillStyle = isDisabled ? "#ef4444" : hasAlternativeRoute ? "#f59e0b" : "#38bdf8";
        ctx.textAlign = "center";
        ctx.fillText(gate.id, pt.x, pt.y - 12);

        // Status tags
        ctx.font = "8px sans-serif";
        if (isDisabled) {
          ctx.fillText("LOCKED", pt.x, pt.y + 11);
        } else if (hasAlternativeRoute) {
          ctx.fillText(`DIVERTED`, pt.x, pt.y + 11);
        }
      });

      // 8. Draw Fans (Particles)
      particlesRef.current.forEach(p => {
        if (p.state === "SAVED") return;

        const pt = project(p.x, p.y, p.z);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        
        if (p.state === "CONGESTED") {
          ctx.shadowColor = "rgba(239, 68, 68, 0.5)";
          ctx.shadowBlur = 3;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Camera compass overlay
      ctx.restore();
      ctx.save();
      ctx.translate(50, height - 50);
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.stroke();

      ctx.rotate((rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(3.5, 2);
      ctx.lineTo(-3.5, 2);
      ctx.closePath();
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(0, 11);
      ctx.lineTo(3.5, -2);
      ctx.lineTo(-3.5, -2);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fill();
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(handleFrame);
    };

    handleFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stadium, activeThreat, rotation, tilt, zoom, autoRotate, showDetailedEgress, disabledGates, routingAdjustments, mitigationActive, agentSpeedModifier, groupSize, simulationSpeed, resources]);

  const standIsAffected = (standName: string, threat: string) => {
    const sLower = standName.toLowerCase();
    const tLower = threat.toLowerCase();
    if (tLower.includes("stand")) {
      const parts = sLower.split(" ");
      return parts.some(part => part.length > 2 && tLower.includes(part));
    }
    return false;
  };

  const colors = getHomeTeamColors(stadium.id);
  const containerBgStyle = {
    background: `radial-gradient(circle at 50% 0%, ${colors.start} 0%, ${colors.end} 100%)`
  };

  return (
    <div style={containerBgStyle} className="relative w-full h-[520px] rounded-2xl border border-white/5 overflow-hidden backdrop-blur-md flex flex-col md:flex-row items-stretch transition-all duration-500">
      {/* Simulation Screen */}
      <div className="flex-1 relative min-h-[360px]">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-grab active:cursor-grabbing block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
        />

        {/* Floating title */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none select-none">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 rounded text-[9px] font-bold text-indigo-400 font-mono tracking-wider">
              {stadium.id.toUpperCase()}_3D_TWIN
            </span>
            {isWankhede && (
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[9px] font-bold text-emerald-400 font-mono tracking-wider">
                INTERACTIVE_IMMERSIVE_MODE
              </span>
            )}
          </div>
          <h4 className="text-white text-sm font-bold tracking-tight uppercase">{stadium.name}</h4>
          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            <span>🖱️ Drag to Rotate/Tilt | Scroll Wheel to Zoom</span>
          </p>
        </div>

        {/* Dynamic Hover Tooltip details */}
        {hoveredEntity && (
          <div 
            className="absolute z-30 pointer-events-none bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col gap-1 text-[11px] font-mono text-slate-300 max-w-[210px] transition-all"
            style={{ 
              left: `${Math.min(canvasRef.current?.clientWidth ? canvasRef.current.clientWidth - 220 : 300, Math.max(10, hoveredEntity.screenX + 16))}px`, 
              top: `${Math.min(canvasRef.current?.clientHeight ? canvasRef.current.clientHeight - 180 : 300, Math.max(10, hoveredEntity.screenY - 32))}px` 
            }}
          >
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-1 select-none">
              <span className={`w-2 h-2 rounded-full ${hoveredEntity.type === 'gate' ? 'bg-sky-400 animate-pulse' : 'bg-indigo-400'}`} />
              <span className="font-extrabold text-white text-[12px]">{hoveredEntity.name}</span>
            </div>
            
            {hoveredEntity.type === "gate" ? (
              <div className="flex flex-col gap-1 pt-0.5 select-none">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px]">FLOW SPEED:</span>
                  <span className="font-bold text-slate-200">{hoveredEntity.stats.flow} active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px]">CONGESTED:</span>
                  <span className={`font-bold ${hoveredEntity.stats.congested > 0 ? "text-red-400 animate-pulse font-extrabold" : "text-green-400"}`}>{hoveredEntity.stats.congested} stalled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px]">EGRESS CAP:</span>
                  <span className="text-sky-300 font-bold">{hoveredEntity.stats.capacityRate}</span>
                </div>
                <div className="flex flex-col gap-0.5 text-[9px] text-slate-500 border-t border-white/10 mt-1 pt-1">
                  <span>REROUTING OVERRIDE:</span>
                  <span className="text-amber-400 font-semibold">{hoveredEntity.stats.rerouted}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 pt-0.5 select-none">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px]">CROWD SIZE:</span>
                  <span className="font-bold text-slate-200">{hoveredEntity.stats.activeFans} fans</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px]">EVACUATED:</span>
                  <span className="text-green-400 font-bold">{hoveredEntity.stats.savedFans} evacuated</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px]">SECTOR CAP:</span>
                  <span className="text-indigo-300 font-bold">{hoveredEntity.stats.standsCap} max</span>
                </div>
                <div className="flex flex-col gap-0.5 text-[9px] text-slate-500 border-t border-white/10 mt-1 pt-1">
                  <span>DANGER STATUS:</span>
                  <span className={`font-bold uppercase ${hoveredEntity.stats.dangerLevel.includes("CRITICAL") ? "text-red-400 animate-pulse font-extrabold" : (hoveredEntity.stats.dangerLevel.includes("WARNING") ? "text-amber-400" : "text-green-400")}`}>{hoveredEntity.stats.dangerLevel}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Critical hazard pulsing sentinel warning overlay */}
        {activeThreat && !mitigationActive && (
          <div className="absolute top-4 right-4 bg-red-950/90 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 animate-bounce shadow-[0_0_20px_rgba(239,68,68,0.45)] max-w-xs select-none z-20">
            <div className="p-2 bg-red-550/20 rounded-lg animate-pulse border border-red-500/40">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="text-[9px] uppercase font-mono tracking-widest text-red-400 font-bold leading-none mb-0.5">HAZARD: CRITICAL</div>
              <div className="text-white text-[11px] font-black font-mono tracking-tight leading-tight">BOTTLENECK EXITS DETECTED</div>
            </div>
          </div>
        )}

        {/* Media simulation recording output HUD indicator */}
        {isRecording && (
          <div className="absolute top-4 right-4 bg-indigo-950/90 border border-indigo-500/50 px-3 py-2 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(99,102,241,0.4)] select-none z-20 animate-pulse">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-550"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-indigo-300 font-bold tracking-wider leading-none mb-0.5">Sim Recording Active</span>
              <span className="text-white font-mono font-bold text-xs">{(recordingProgress * 5).toFixed(1)}s / 5.0s</span>
            </div>
          </div>
        )}

        {/* Evacuation loader bar */}
        {activeThreat && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-black/85 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shadow-2xl max-w-sm flex flex-col gap-1.5 z-10 transition-all">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                SECURE EGRESS ENGINE
              </span>
              <span className={`${fanEvacuationProgress >= 100 ? "text-green-400" : "text-amber-400"} font-bold`}>
                {fanEvacuationProgress}% SECURED
              </span>
            </div>
            
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  fanEvacuationProgress >= 100 
                    ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
                    : "bg-amber-500 animate-pulse"
                }`}
                style={{ width: `${fanEvacuationProgress}%` }}
              />
            </div>

            <p className="text-[9px] text-slate-400 leading-tight">
              {fanEvacuationProgress >= 100 
                ? "✓ Complete stadium evacuation secured successfully within safety limits."
                : mitigationActive 
                  ? "✓ AI Consensus dynamic routing overriding bottlenecks. Particles moving to safe exits."
                  : "⚠ Bottleneck danger alert at Gate exits. Deploy AI Agents to balance paths."
              }
            </p>
          </div>
        )}

        {/* Deployed Resources Summary Panel Overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-950/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl w-[260px] flex flex-col gap-2.5 z-20 pointer-events-auto">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="font-extrabold text-white text-[10px] tracking-wide uppercase font-mono">DEPLOYED HUD</span>
            </div>
            <span className="text-[8px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 rounded font-bold font-mono uppercase">Live Response</span>
          </div>

          {/* Crowd Congestion Warning block inside resource panel */}
          {highCongestionSectorNames.length > 0 ? (
            <div className="bg-red-950/20 border border-red-500/20 rounded-lg p-2 flex flex-col gap-1 select-none animate-pulse">
              <div className="flex items-center gap-1 text-[9px] font-bold text-red-400 font-mono">
                <AlertTriangle className="w-3 h-3 text-red-555 animate-bounce" />
                <span>ALERT: UNBALANCED COLD_SECTORS</span>
              </div>
              <p className="text-[8.5px] text-slate-300 font-mono leading-tight">
                Congestion peak: <span className="text-white font-bold">{highCongestionSectorNames.join(", ")} Stand</span>
              </p>
            </div>
          ) : (
            <div className="bg-emerald-950/15 border border-emerald-500/15 rounded-lg p-2 text-[8.5px] text-emerald-400/90 flex items-center gap-1.5 font-mono select-none">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>All crowd sectors running within nominal flow bounds.</span>
            </div>
          )}

          {/* Deployed Staff Scroll Unit List */}
          <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
            {resources.map((res) => (
              <div key={res.id} className="bg-white/5 p-2 rounded-lg border border-white/5 flex flex-col gap-1 hover:bg-white/[0.08] transition-all">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${res.type === "medical" ? "bg-red-500 animate-pulse" : "bg-sky-500"}`} />
                    {res.id}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                    res.status === "PATROLLING" ? "bg-slate-800 text-slate-400" 
                    : res.status === "ON_SITE" ? "bg-sky-500/15 text-sky-400" 
                    : "bg-red-500/15 text-red-400"
                  }`}>
                    {res.status}
                  </span>
                </div>
                <div className="flex justify-between text-[8px] text-slate-400 font-mono leading-tight">
                  <span>SECTOR:</span>
                  <span className="text-indigo-300 font-bold uppercase">
                    {stadium.stands[res.standIndex]?.name.split(" ")[0] || "GATE REGION"}
                  </span>
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 font-mono leading-tight">
                  <span>BATTERY & NET:</span>
                  <span>⚡{res.batteryLevel}% | {res.contactFreq}</span>
                </div>

                {/* Dispatch drop down to move resources explicitly manually */}
                <div className="flex items-center justify-between border-t border-white/5 pt-1.5 mt-1">
                  <span className="text-[7.5px] text-slate-500 font-mono">DISPATCH:</span>
                  <select
                    value={res.standIndex}
                    onChange={(e) => {
                      const newIdx = parseInt(e.target.value);
                      setResources(prev => prev.map(r => r.id === res.id ? { ...r, standIndex: newIdx, status: "ON_SITE" } : r));
                    }}
                    className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-[8px] text-slate-300 font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {stadium.stands.map((s, idx) => (
                      <option key={idx} value={idx}>{s.name.split(" ")[0]}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* One-click Redeploy Smart Balancer */}
          {highCongestionSectorNames.length > 0 && (
            <button
              onClick={() => {
                const highIdx = stadium.stands.findIndex(s => highCongestionSectorNames.some(name => s.name.toLowerCase().includes(name.toLowerCase())));
                if (highIdx !== -1) {
                  setResources(prev => prev.map(r => ({
                    ...r,
                    standIndex: highIdx,
                    status: r.type === "medical" ? "TREAT_ACTIVE" : "ON_SITE"
                  })));
                }
              }}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[9px] font-mono tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-1 border border-indigo-400/20 active:scale-95 shadow-lg shadow-indigo-500/10"
            >
              <Zap className="w-3 h-3 text-indigo-300 animate-bounce" />
              <span>RALLY ALL TO CONGESTION</span>
            </button>
          )}
        </div>
      </div>

      {/* Camera and Layer configurations sidebar */}
      <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-white/5 bg-black/40 p-4 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-300 font-bold border-b border-white/5 pb-2">
            <Settings className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-mono uppercase tracking-wider">3D ENGINE HUD</span>
          </div>

          {/* Camera adjustments */}
          <div className="flex flex-col gap-1.5 text-[10px] font-mono text-slate-400">
            <span>ISOMETRIC CAMERA ZOOM</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setZoom(z => Math.max(0.4, z - 0.15))}
                className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-white border border-white/5 flex justify-center items-center gap-1 text-xs"
              >
                <ZoomOut size={12} />
                <span>OUT</span>
              </button>
              <button 
                onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
                className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-white border border-white/5 flex justify-center items-center gap-1 text-xs"
              >
                <ZoomIn size={12} />
                <span>IN</span>
              </button>
            </div>
          </div>

          {/* PRESET VIEWPORTS */}
          <div className="flex flex-col gap-1.5 text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
            <span>PRESET INTERACTIVE VIEWPORTS</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setRotation(-40);
                  setTilt(42);
                  setZoom(1.25);
                  setAutoRotate(false);
                }}
                className="py-1 px-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-[9px] text-indigo-300 border border-indigo-500/20 font-bold transition-all text-center active:scale-95"
              >
                TACTICAL ISO
              </button>
              <button
                onClick={() => {
                  setRotation(0);
                  setTilt(85);
                  setZoom(1.15);
                  setAutoRotate(false);
                }}
                className="py-1 px-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-[9px] text-sky-300 border border-sky-500/20 font-bold transition-all text-center active:scale-95"
              >
                BIRD'S EYE
              </button>
              <button
                onClick={() => {
                  setRotation(90);
                  setTilt(22);
                  setZoom(1.4);
                  setAutoRotate(false);
                }}
                className="py-1 px-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-[9px] text-emerald-300 border border-emerald-500/20 font-bold transition-all text-center active:scale-95"
              >
                EAST GATE
              </button>
              <button
                onClick={() => {
                  setRotation(-90);
                  setTilt(30);
                  setZoom(1.4);
                  setAutoRotate(false);
                }}
                className="py-1 px-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-[9px] text-amber-300 border border-amber-500/20 font-bold transition-all text-center active:scale-95"
              >
                WEST BLOCKS
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
            <span>CAMERA SPIN</span>
            <button 
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2 py-0.5 rounded text-[9px] border transition-all ${
                autoRotate 
                  ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400 font-bold shadow-sm animate-pulse" 
                  : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              {autoRotate ? "ACTIVE" : "STATIONARY"}
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
            <span>ESCAPE VEGETS</span>
            <button 
              onClick={() => setShowDetailedEgress(!showDetailedEgress)}
              className={`px-2 py-0.5 rounded text-[9px] border transition-all ${
                showDetailedEgress 
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold" 
                  : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              {showDetailedEgress ? "VISIBLE" : "HIDDEN"}
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
            <span>THERMAL HUD</span>
            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2 py-0.5 rounded text-[9px] border transition-all ${
                showHeatmap 
                  ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-500 font-bold shadow-sm" 
                  : "bg-white/5 border-white/10 text-slate-400"
              }`}
            >
              {showHeatmap ? "HEATMAP ON" : "HEATMAP OFF"}
            </button>
          </div>

          <div className="flex flex-col gap-1.5 text-[10px] font-mono text-slate-400 pt-1.5 border-t border-white/5">
            <span>INCIDENT EXPORTER</span>
            <button 
              onClick={handleExportVideo}
              disabled={isRecording}
              className={`w-full py-1 rounded text-center text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isRecording 
                  ? "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse cursor-not-allowed font-extrabold" 
                  : "bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-md active:scale-95"
              }`}
            >
              <Video size={12} className={isRecording ? "animate-spin" : ""} />
              <span>{isRecording ? "RECORDING..." : "EXPORT REPORT"}</span>
            </button>
          </div>
        </div>

        {/* Legend Map Indicators */}
        <div className="flex flex-col gap-2 border-t border-white/5 pt-2">
          <span className="text-[9px] font-mono text-slate-500 tracking-wider">MAP KEY INDEX</span>
          
          <div className="flex flex-col gap-1.5 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between items-center bg-white/5 p-1 rounded border border-white/5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>Egress Path</span>
              </span>
              <span className="text-[9px] text-slate-500">Active</span>
            </div>
            
            <div className="flex justify-between items-center bg-white/5 p-1 rounded border border-white/5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span>Blocked exit</span>
              </span>
              <span className="text-[9px] text-red-400">Locked</span>
            </div>

            <div className="flex justify-between items-center bg-white/5 p-1 rounded border border-white/5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span>Diverted Link</span>
              </span>
              <span className="text-[9px] text-amber-400">Diverted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
