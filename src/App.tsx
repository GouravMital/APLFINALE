import React, { useState, useEffect, useRef } from "react";
import ThreeJS_Visualizer from "./components/ThreeJS_Visualizer";
import { Stadium, Gate, SimulationThreat } from "./types";
import { 
  Shield, 
  ShieldCheck,
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Activity, 
  CheckCircle2, 
  Radio, 
  Users, 
  Zap, 
  Send, 
  Layers, 
  Download, 
  Terminal, 
  Flame, 
  MapPin, 
  UserCheck,
  ChevronRight,
  Info,
  Video,
  Eye,
  RefreshCw,
  Sliders,
  Grid,
  HardDrive,
  Camera
} from "lucide-react";

const getStadiumTheme = (id: string | undefined) => {
  if (!id) return {
    franchise: "IPL Command Center",
    gradientStyle: {
      background: "radial-gradient(circle at 50% -20%, #15152a 0%, #050505 85%)"
    },
    accentColor: "text-indigo-400",
    borderGlow: "rgba(99, 102, 241, 0.2)",
    canvasBgStart: "rgba(21, 21, 42, 0.45)",
    canvasBgEnd: "rgba(5, 5, 5, 1)"
  };

  const cleanId = id.trim().toLowerCase();
  switch(cleanId) {
    case "wankhede": // Mumbai Indians
      return {
        franchise: "Mumbai Indians",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #0a225e 0%, #020714 85%)"
        },
        accentColor: "text-blue-400",
        borderGlow: "rgba(59, 130, 246, 0.2)",
        canvasBgStart: "rgba(10, 34, 94, 0.45)",
        canvasBgEnd: "rgba(2, 7, 20, 1)"
      };
    case "eden_gardens": // Kolkata Knight Riders
      return {
        franchise: "Kolkata Knight Riders",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #3a0d5c 0%, #06020c 85%)"
        },
        accentColor: "text-purple-400",
        borderGlow: "rgba(168, 85, 247, 0.2)",
        canvasBgStart: "rgba(58, 13, 92, 0.5)",
        canvasBgEnd: "rgba(6, 2, 12, 1)"
      };
    case "chepauk":
    case "chidambaram": // Chennai Super Kings
      return {
        franchise: "Chennai Super Kings",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #4a3e05 0%, #0c0a01 85%)"
        },
        accentColor: "text-yellow-400",
        borderGlow: "rgba(234, 179, 8, 0.2)",
        canvasBgStart: "rgba(74, 62, 5, 0.45)",
        canvasBgEnd: "rgba(12, 10, 1, 1)"
      };
    case "chinnaswamy": // Royal Challengers Bengaluru
      return {
        franchise: "Royal Challengers Bengaluru",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #4a0505 0%, #0a0101 85%)"
        },
        accentColor: "text-red-500",
        borderGlow: "rgba(239, 68, 68, 0.2)",
        canvasBgStart: "rgba(74, 5, 5, 0.45)",
        canvasBgEnd: "rgba(10, 1, 1, 1)"
      };
    case "narendra_modi": // Gujarat Titans
      return {
        franchise: "Gujarat Titans",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #0b1a38 0%, #02050f 85%)"
        },
        accentColor: "text-cyan-400",
        borderGlow: "rgba(6, 182, 212, 0.2)",
        canvasBgStart: "rgba(11, 26, 56, 0.45)",
        canvasBgEnd: "rgba(2, 5, 15, 1)"
      };
    case "dharamshala":
    case "hpca_dharamshala": // Punjab Kings
      return {
        franchise: "Punjab Kings",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #4a0404 0%, #0a0101 85%)"
        },
        accentColor: "text-red-400",
        borderGlow: "rgba(239, 68, 68, 0.2)",
        canvasBgStart: "rgba(74, 4, 4, 0.45)",
        canvasBgEnd: "rgba(10, 1, 1, 1)"
      };
    case "feroz_shah_kotla":
    case "arun_jaitley": // Delhi Capitals
      return {
        franchise: "Delhi Capitals",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #05193d 0%, #010412 85%)"
        },
        accentColor: "text-blue-500",
        borderGlow: "rgba(59, 130, 246, 0.2)",
        canvasBgStart: "rgba(5, 25, 61, 0.45)",
        canvasBgEnd: "rgba(1, 4, 18, 1)"
      };
    case "rajiv_gandhi":
    case " rajiv_gandhi": // Sunrisers Hyderabad
      return {
        franchise: "Sunrisers Hyderabad",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #4a1d04 0%, #0c0501 85%)"
        },
        accentColor: "text-orange-500",
        borderGlow: "rgba(249, 115, 22, 0.2)",
        canvasBgStart: "rgba(74, 29, 4, 0.45)",
        canvasBgEnd: "rgba(12, 5, 1, 1)"
      };
    case "ekana":
    case "ekana_sports_city": // Lucknow Super Giants
      return {
        franchise: "Lucknow Super Giants",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #041f3a 0%, #010812 85%)"
        },
        accentColor: "text-sky-400",
        borderGlow: "rgba(56, 189, 248, 0.2)",
        canvasBgStart: "rgba(4, 31, 58, 0.45)",
        canvasBgEnd: "rgba(1, 8, 18, 1)"
      };
    case "pca_bindra": // Mohali Kings
      return {
        franchise: "Punjab Kings",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #400505 0%, #080000 85%)"
        },
        accentColor: "text-red-400",
        borderGlow: "rgba(239, 68, 68, 0.2)",
        canvasBgStart: "rgba(64, 5, 5, 0.45)",
        canvasBgEnd: "rgba(8, 0, 0, 1)"
      };
    case "sawai_mansingh": // Rajasthan Royals
      return {
        franchise: "Rajasthan Royals",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #4c0528 0%, #0c0106 85%)"
        },
        accentColor: "text-pink-400",
        borderGlow: "rgba(244, 63, 94, 0.2)",
        canvasBgStart: "rgba(76, 5, 40, 0.45)",
        canvasBgEnd: "rgba(12, 1, 6, 1)"
      };
    default:
      return {
        franchise: "IPL Arena",
        gradientStyle: {
          background: "radial-gradient(circle at 50% -20%, #15152a 0%, #050505 85%)"
        },
        accentColor: "text-indigo-400",
        borderGlow: "rgba(99, 102, 241, 0.2)",
        canvasBgStart: "rgba(21, 21, 42, 0.45)",
        canvasBgEnd: "rgba(5, 5, 5, 1)"
      };
  }
};

export default function App() {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [activeThreat, setActiveThreat] = useState<string | null>(null);
  const [disabledGates, setDisabledGates] = useState<string[]>([]);
  const [routingAdjustments, setRoutingAdjustments] = useState<Record<string, string>>({});
  const [mitigationActive, setMitigationActive] = useState<boolean>(false);
  const [fanEvacuationProgress, setFanEvacuationProgress] = useState<number>(0);

  // NVIDIA NIM CCTV Analytics States
  const [selectedCctvCamId, setSelectedCctvCamId] = useState<string>("CAM-01");
  const [nvidiaScanResult, setNvidiaScanResult] = useState<{
    peopleCount: number;
    confidence: number;
    hazardIndex: number;
    congestionLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    latencyTicksMs: number;
    remedy: string;
    realNvidiaNim: boolean;
  } | null>({
    peopleCount: 142,
    confidence: 98.42,
    hazardIndex: 35,
    congestionLevel: "MODERATE",
    latencyTicksMs: 12,
    remedy: "Continue active CCTV analytics monitoring. Flow parameters are nominal.",
    realNvidiaNim: false
  });
  const [isNvidiaScanning, setIsNvidiaScanning] = useState<boolean>(false);

  // Authentication & Emergency Broadcast States
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("sentinel_token");
    } catch {
      return null;
    }
  });
  const [loginUsername, setLoginUsername] = useState<string>("admin");
  const [loginPassword, setLoginPassword] = useState<string>("sentinel2026");
  const [authError, setAuthError] = useState<string>("");
  const [targetBroadcastMsg, setTargetBroadcastMsg] = useState<string>("");
  const [targetBroadcastSeverity, setTargetBroadcastSeverity] = useState<string>("warning");
  const [broadcastProgress, setBroadcastProgress] = useState<boolean>(false);

  // Polled notifications state for user emergency feeds
  const [polledNotifications, setPolledNotifications] = useState<Array<{
    id: string;
    message: string;
    type: string;
    timestamp: string;
    active: boolean;
  }>>([]);

  const lastAlertIdAnnounced = useRef<string | null>(null);
  const [voiceMuted, setVoiceMuted] = useState<boolean>(false);

  const fetchLiveBroadcasts = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setPolledNotifications(data);
        
        // Dynamic voice TTS alert when a brand-new warning/critical emergency is dispatched to users!
        if (data && data.length > 0) {
          const latest = data[0];
          if (latest.id !== lastAlertIdAnnounced.current) {
            lastAlertIdAnnounced.current = latest.id;
            // Skip announcing initial startup notification so we only play custom live alerts
            if (latest.id !== "NOTIF-INITIAL-1" && !voiceMuted && window.speechSynthesis) {
              window.speechSynthesis.cancel();
              const voiceMsg = `Emergency broadcast: ${latest.message}`;
              const utterance = new SpeechSynthesisUtterance(voiceMsg);
              utterance.rate = 1.0;
              window.speechSynthesis.speak(utterance);
            }
          }
        }
      }
    } catch (err) {
      console.warn("Could not poll live administrator alerts:", err);
    }
  };

  // Run initial poll and schedule interval
  useEffect(() => {
    fetchLiveBroadcasts();
    const interval = setInterval(fetchLiveBroadcasts, 3000);
    return () => clearInterval(interval);
  }, [voiceMuted]);

  // Handler to perform CCTV deep count using the NVIDIA Key on the backend
  const runNvidiaCctvScan = async (camId: string, baseDensity: number, camDesc: string) => {
    setIsNvidiaScanning(true);
    setSelectedCctvCamId(camId);
    try {
      const response = await fetch("/api/cctv-analyze-nvidia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cameraId: camId,
          camDesc: camDesc,
          baseDensity: baseDensity,
          stadiumId: selectedStadium?.id || "wankhede"
        })
      });
      if (response.ok) {
        const data = await response.json();
        setNvidiaScanResult(data);
        
        // Update general advice
        setCameraAdvice(`[NVIDIA NIM PeopleNet count: ${data.peopleCount} spectators] ${data.remedy}`);
        
        // Instantly synchronise 3D digital simulation hazard parameters if density is heavy or critical!
        if (data.congestionLevel === "CRITICAL" || data.congestionLevel === "HIGH") {
          setActiveThreat(`[NVIDIA CCTV CROWD ALERT] Bottleneck anomaly at ${camDesc}. Counted spectators: ${data.peopleCount}. Density capacity limit exceeded.`);
          setMitigationActive(false);
          setFanEvacuationProgress(0);
        }
      }
    } catch (err) {
      console.error("NVIDIA CCTV counting error:", err);
    } finally {
      setIsNvidiaScanning(false);
    }
  };

  // Authentication controllers
  const handleAdminAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAdminToken(data.token);
        try {
          localStorage.setItem("sentinel_token", data.token);
        } catch {}
      } else {
        setAuthError(data.error || "Authentication failed. Unauthorized passcode.");
      }
    } catch (err) {
      setAuthError("Could not reach authentication service. Please check backend connection.");
    }
  };

  const handleAdminAuthLogout = async () => {
    if (adminToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: adminToken })
        });
      } catch (err) {
        console.warn("Logout request failed:", err);
      }
    }
    setAdminToken(null);
    try {
      localStorage.removeItem("sentinel_token");
    } catch {}
  };

  const handleBroadcastEmergencyAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBroadcastMsg.trim()) return;
    setBroadcastProgress(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: targetBroadcastMsg,
          type: targetBroadcastSeverity,
          token: adminToken
        })
      });
      if (response.ok) {
        setTargetBroadcastMsg("");
        fetchLiveBroadcasts(); // Instant manual pull update
      } else {
        const errData = await response.json();
        alert(errData.error || "Broadcast rejected.");
      }
    } catch (err) {
      console.error("Dispatch broadcast failure:", err);
    } finally {
      setBroadcastProgress(false);
    }
  };
  
  // Custom simulation variables
  const [agentSpeedModifier, setAgentSpeedModifier] = useState<number>(1.0); // 0.5 to 1.5
  const [groupSize, setGroupSize] = useState<number>(2); // 1 to 10
  const [crowdDensity, setCrowdDensity] = useState<"low" | "medium" | "high">("medium");
  const [simulationSpeed, setSimulationSpeed] = useState<number>(0); // requestAnimationFrame delay in ms
  const [exportFormat, setExportFormat] = useState<"GLTF" | "OBJ" | "PLY">("GLTF");

  const [manualThreat, setManualThreat] = useState<string>("");
  const [isNegotiating, setIsNegotiating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"visualizer" | "gltf-exporter" | "cctv-feed">("visualizer");

  // Multi-operator Dynamic Roles & Match Time states
  const [userRole, setUserRole] = useState<"admin" | "spectator">("admin");
  const [matchPhase, setMatchPhase] = useState<"arrival" | "powerplay" | "mid_break" | "final_overs" | "departure">("powerplay");
  const [scalabilitySaver, setScalabilitySaver] = useState<boolean>(false); // dynamic low bandwidth performance mode
  
  // Spectator Crowds-Avoidance State variables
  const [spectatorStand, setSpectatorStand] = useState<string>("Garware Stand");
  const [spectatorDestination, setSpectatorDestination] = useState<string>("Vinoo Mankad Gate-2");
  const [offlineReceiptSaved, setOfflineReceiptSaved] = useState<boolean>(false);
  const [savedOfflineRoutes, setSavedOfflineRoutes] = useState<Array<{id: string, stand: string, gate: string, time: string}>>(() => {
    try {
      const stored = localStorage.getItem("ipl_offline_routes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // OCR Ticketing Scanner details state
  const [ocrHeadcount, setOcrHeadcount] = useState<number>(1422);
  const [ocrEntries, setOcrEntries] = useState<Array<{ticketId: string, timestamp: string, gate: string, status: string, crowdEst: number}>>([
    { ticketId: "IPL-G4-904312", timestamp: "15:08:22", gate: "Gate-4", status: "NOMINAL", crowdEst: 42 },
    { ticketId: "IPL-G2-118491", timestamp: "15:09:05", gate: "Gate-2", status: "CONGESTED", crowdEst: 78 },
    { ticketId: "IPL-G1-552943", timestamp: "15:09:41", gate: "Gate-1", status: "NOMINAL", crowdEst: 31 }
  ]);

  // Multi-agent negotiation dialog logs
  const [agentLogs, setAgentLogs] = useState<{
    role: "Librarian" | "Sentinel" | "Strategist" | "Executor";
    message: string;
    type: "info" | "warning" | "success" | "negotiate";
    timestamp: string;
  }[]>([]);

  // Simulated push webhook logs
  const [webhookLogs, setWebhookLogs] = useState<string[]>([]);

  // CCTV Camera Integration & AI Voice Sentinel Agent States
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isScanningCCTV, setIsScanningCCTV] = useState<boolean>(false);
  const [cameraAdvice, setCameraAdvice] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startSentinelCCTV = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240, facingMode: "user" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log("Play interrupted", e));
      }
      setIsCameraActive(true);
    } catch (e) {
      console.warn("Camera hardware not available or permission denied, using mock visual", e);
      setIsCameraActive(true); // Fallback mock state so it remains interactive and cool
    }
  };

  const stopSentinelCCTV = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraAdvice("");
  };

  const triggerCCTVScanAndVoiceAdvice = async () => {
    if (!selectedStadium) return;
    setIsScanningCCTV(true);
    setCameraAdvice("Processing neural video frames... Scanning crowd density thresholds.");
    
    await new Promise(r => setTimeout(r, 1600)); // Simulating deep AI analysis delay
    
    const sName = selectedStadium.name;
    const adviceText = `Security Advisory for ${sName}: Live camera density scanning indicates high congestion build-up near the East Pavilion vomitories. Ground crowd density has reached eighty-eight percent, impeding normal evacuation. I advise activating consensus bypass. Let us immediately unlock Vinoo Mankad Gate number two to disperse the crowd, and notify municipal services.`;
    
    setCameraAdvice(adviceText);
    setIsScanningCCTV(false);
    
    // Auto-inject threat and route mitigations in the 3D twin
    setActiveThreat(`[Camera AI Detect] Severe bottleneck near East Pavilion sectors at ${sName}.`);
    setDisabledGates(["Gate-4"]); // locks gate 4
    
    // HTML5 Voice synthesis Speech
    if (!voiceMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(adviceText);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }

    // Dispatch webhook to staff
    setWebhookLogs(prev => [
      `[STAFF ALERT DIRECTED] To Team Bravo: Redirect crowd to Gate-2; clear outer fence corridors immediately. Code: AI_PERIM_SCAN`,
      `[WEBHOOK] CCTV neural model triggered autonomous notification to command staff`,
      ...prev
    ]);

    // Add agent logs
    const timeString = () => new Date().toLocaleTimeString();
    setAgentLogs(prev => [
      {
        role: "Sentinel",
        message: `[AI CCTV THREAT] High congestion near East Pavilion. Commencing dynamic gate bypass strategies now. Outputting Voice advisory directives.`,
        type: "warning",
        timestamp: timeString()
      },
      ...prev
    ]);

    setRoutingAdjustments({ "Gate-4": "Gate-2" });
    setMitigationActive(true);
  };

  const handleSaveOfflinePlan = () => {
    const newRoute = {
      id: `ROUTE-${Math.floor(1000 + Math.random() * 9000)}`,
      stand: spectatorStand,
      gate: spectatorDestination,
      time: new Date().toLocaleTimeString()
    };
    const updated = [newRoute, ...savedOfflineRoutes];
    setSavedOfflineRoutes(updated);
    try {
      localStorage.setItem("ipl_offline_routes", JSON.stringify(updated));
    } catch (err) {
      console.warn("Storage limits exceeded", err);
    }
    setOfflineReceiptSaved(true);
    setTimeout(() => setOfflineReceiptSaved(false), 2400);
  };

  const getConcessionQueues = (phase: string) => {
    switch (phase) {
      case "arrival":
        return [
          { name: "Pavilion Prime Burgers", load: "Low (No wait)", val: 12, status: "NOMINAL" },
          { name: "Garware Refreshment Kiosk 2", load: "Low", val: 5, status: "NOMINAL" },
          { name: "East Stand Washroom Corridor", load: "Moderate", val: 35, status: "NOMINAL" },
          { name: "VIP Brew Lounge", load: "Nominal", val: 20, status: "NOMINAL" }
        ];
      case "powerplay":
        return [
          { name: "Pavilion Prime Burgers", load: "Nominal (2 min)", val: 24, status: "NOMINAL" },
          { name: "Garware Refreshment Kiosk 2", load: "Nominal", val: 15, status: "NOMINAL" },
          { name: "East Stand Washroom Corridor", load: "Low", val: 8, status: "NOMINAL" },
          { name: "VIP Brew Lounge", load: "Nominal", val: 18, status: "NOMINAL" }
        ];
      case "mid_break":
        return [
          { name: "Pavilion Prime Burgers", load: "CRITICAL BUNDLE (14 min delay)", val: 95, status: "CRITICAL" },
          { name: "Garware Refreshment Kiosk 2", load: "CONGESTED (8 min delay)", val: 78, status: "WARNING" },
          { name: "East Stand Washroom Corridor", load: "HIGH CONGESTION (11 min delay)", val: 88, status: "WARNING" },
          { name: "VIP Brew Lounge", load: "Nominal", val: 40, status: "NOMINAL" }
        ];
      case "final_overs":
        return [
          { name: "Pavilion Prime Burgers", load: "Moderate", val: 38, status: "NOMINAL" },
          { name: "Garware Refreshment Kiosk 2", load: "Low", val: 18, status: "NOMINAL" },
          { name: "East Stand Washroom Corridor", load: "Low", val: 15, status: "NOMINAL" },
          { name: "VIP Brew Lounge", load: "Low (Exit traffic)", val: 12, status: "NOMINAL" }
        ];
      case "departure":
        return [
          { name: "Pavilion Prime Burgers", load: "Closed - Staff Evacuating", val: 0, status: "NOMINAL" },
          { name: "Garware Refreshment Kiosk 2", load: "Closed", val: 0, status: "NOMINAL" },
          { name: "East Stand Washroom Corridor", load: "Emergency Bypass Path Active", val: 10, status: "NOMINAL" },
          { name: "VIP Brew Lounge", load: "Closed", val: 0, status: "NOMINAL" }
        ];
      default:
        return [];
    }
  };

  // Load stadiums on mount
  useEffect(() => {
    fetch("/api/stadiums")
      .then(res => res.json())
      .then((data: Stadium[]) => {
        setStadiums(data);
        if (data && data.length > 0) {
          // Default to Wankhede Stadium as highlighted by user, otherwise first item
          const wankhede = data.find(s => s.id === "wankhede");
          setSelectedStadium(wankhede || data[0]);
        }
      })
      .catch(err => console.error("Error loading stadium data:", err));
  }, []);

  // Automated Speech Synthesis TTS on active threats
  useEffect(() => {
    if (activeThreat && !voiceMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const warningSpeech = `Attention spectators: ${activeThreat}. Dynamic safety overrides are active. Please monitor illuminated green LED path indicators and follow directed exit routing to safety. Security responders are executing consensus gateway bypass.`;
      const utterance = new SpeechSynthesisUtterance(warningSpeech);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);

      setAgentLogs(prev => [
        {
          role: "Executor",
          message: `[TTS VOICE ALARM ACTIVATED] Synthesized Public Warning: "${warningSpeech}"`,
          type: "success",
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }
  }, [activeThreat, voiceMuted]);

  // Match-time predictive modeling updates
  useEffect(() => {
    if (!selectedStadium) return;
    const timeVal = new Date().toLocaleTimeString();
    
    let message = "";
    let alertType: "info" | "warning" | "success" = "info";
    
    if (matchPhase === "arrival") {
      message = `[MATCH TIME PREDICTION: PRE-MATCH ENTRY SURGE] High crowd flow volume inbound. Primary bottleneck build-up predicted at Gate-1 and Gate-2 entry turnstiles. Calculated entry buffer required: +18%. Deploy ticket-scanning OCR assistance to north gates.`;
      setCrowdDensity("medium");
      setAgentSpeedModifier(1.0);
    } else if (matchPhase === "powerplay") {
      message = `[MATCH TIME PREDICTION: POWERPLAY SEATING] Main innings underway. Core bowl seating zones settled at 95% capacity at ${selectedStadium.name}. Walkway corridors clear. Security team status: nominal.`;
      alertType = "success";
      setCrowdDensity("low");
      setAgentSpeedModifier(0.8);
    } else if (matchPhase === "mid_break") {
      message = `[MATCH TIME PREDICTION: INNINGS BREAK OUTLET surge] Innings break logged. Massive interior concession surge calculated. Predicted crowd bottleneck at central food courts, burger stalls and washrooms. Re-routing recommended to empty outer rings.`;
      alertType = "warning";
      setCrowdDensity("high");
      setAgentSpeedModifier(1.2);
    } else if (matchPhase === "final_overs") {
      message = `[MATCH TIME PREDICTION: DEATH OVERS EXIT PREP] Early departure movement identified. 14% of guests moving toward exits early to avoid post-match crowds. Sunil Gavaskar stand and Garware Gate-4 pre-exit lines active.`;
      setCrowdDensity("medium");
      setAgentSpeedModifier(1.1);
    } else if (matchPhase === "departure") {
      message = `[MATCH TIME PREDICTION: MATCH CONCLUDED OUTFLOWS] Extreme post-match bulk surge! Unified egress direction launched. Predicted high congestion bottleneck at Garware Gate-4 and Vinoo Mankad Gate-2. Dynamic bypass routing recommended!`;
      alertType = "warning";
      setCrowdDensity("high");
      setAgentSpeedModifier(1.4);
    }

    setAgentLogs(prev => [
      {
        role: "Sentinel",
        message,
        type: alertType === "warning" ? "warning" : alertType === "success" ? "success" : "info",
        timestamp: timeVal
      },
      ...prev
    ]);
  }, [matchPhase, selectedStadium]);

  // Simulated ML OCR Ticket entry reader feed
  useEffect(() => {
    const interval = setInterval(() => {
      const liveGates = ["Gate-1", "Gate-2", "Gate-3", "Gate-4"];
      const randGate = liveGates[Math.floor(Math.random() * liveGates.length)];
      const isHighCongestion = disabledGates.includes(randGate);
      
      const rate = isHighCongestion ? Math.floor(1 + Math.random() * 4) : Math.floor(12 + Math.random() * 38);
      
      // tick up the headcount
      setOcrHeadcount(prev => prev + rate);
      
      // append random scans
      const nextTicketId = `IPL-OCR-${randGate.replace("Gate-", "G")}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      setOcrEntries(prev => [
        {
          ticketId: nextTicketId,
          timestamp: new Date().toLocaleTimeString(),
          gate: randGate,
          status: rate > 30 ? "OUTFLOW_SURGE" : rate < 6 ? "BLOCKED_FLOW" : "NOMINAL",
          crowdEst: Math.round(rate * 1.6)
        },
        ...prev.slice(0, 8)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, [disabledGates]);

  // Set default parameters when stadium changes
  const handleStadiumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const st = stadiums.find(s => s.id === e.target.value);
    if (st) {
      setSelectedStadium(st);
      resetSimulation();
    }
  };

  const resetSimulation = () => {
    setActiveThreat(null);
    setDisabledGates([]);
    setRoutingAdjustments({});
    setMitigationActive(false);
    setFanEvacuationProgress(0);
    setAgentLogs([]);
    setWebhookLogs([]);
    setManualThreat("");
  };

  // Preset strategic threat templates
  const injectThreatPreset = (type: "gate_failure" | "stand_hazard" | "flood_alert") => {
    if (!selectedStadium) return;
    
    resetSimulation();
    let threatText = "";
    let mockGates: string[] = [];

    switch (type) {
      case "gate_failure":
        threatText = "Gate 4 structural sensor failure - automatic safety lockdown triggered near Garware Stand.";
        mockGates = ["Gate-4"];
        break;
      case "stand_hazard":
        threatText = "Heat flare / smoke outbreak detected in lower stand tier under Section B. Area isolated.";
        mockGates = ["Gate-2"];
        break;
      case "flood_alert":
        threatText = "Flash flood flash emergency near outer West Concourse - emergency services blocking primary exit paths.";
        mockGates = ["Gate-1"];
        break;
    }

    setActiveThreat(threatText);
    setDisabledGates(mockGates);
    
    // Auto initiate inter-agent negotiations
    initiateNegotiation(threatText, mockGates);
  };

  const handleManualThreatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualThreat.trim()) return;
    
    resetSimulation();
    const txt = manualThreat.trim();
    setActiveThreat(txt);
    
    // Intelligently lock gates matching text keywords
    const locked: string[] = [];
    if (txt.toLowerCase().includes("gate 4") || txt.toLowerCase().includes("gate-4")) {
      locked.push("Gate-4");
    } else if (txt.toLowerCase().includes("gate 1") || txt.toLowerCase().includes("gate-1")) {
      locked.push("Gate-1");
    } else {
      // default lock gate-2
      locked.push("Gate-2");
    }
    
    setDisabledGates(locked);
    initiateNegotiation(txt, locked);
  };

  // Multi-Agent Consensus Negotiation Orchestration with real time stream logs
  const initiateNegotiation = async (threat: string, baseDisabled: string[]) => {
    if (!selectedStadium) return;

    setIsNegotiating(true);
    setAgentLogs([]);
    setWebhookLogs([]);

    const timeString = () => new Date().toLocaleTimeString();

    // Agent 1: Librarian Retrieval
    setAgentLogs(prev => [
      ...prev,
      {
        role: "Librarian",
        message: `[Registry Probe] Scanning database coordinates for ${selectedStadium.name}. Confirmed ${selectedStadium.gates.length} exits, dimensions ${selectedStadium.dimensions.length}m x ${selectedStadium.dimensions.width}m, and ${selectedStadium.stands.length} localized seating stands.`,
        type: "info",
        timestamp: timeString()
      }
    ]);

    await new Promise(r => setTimeout(r, 900));

    // Agent 2: Sentinel Dynamics (NVIDIA NIM Physical simulation parameters)
    const densityCoefficient = 1.0 + (groupSize - 1) * 0.14;
    const standardEvacTime = Math.round((24.0 / agentSpeedModifier) * densityCoefficient * 10) / 10;

    setAgentLogs(prev => [
      ...prev,
      {
        role: "Sentinel",
        message: `[NVIDIA NIM Physics Engine] 60fps fluid particle tracking loaded. Detected Critical Bottlenecks near: ${baseDisabled.join(", ")}. Density calculated at ${(1.5 * densityCoefficient).toFixed(2)}x standard limits. Predicted evacuation baseline takes ${standardEvacTime} mins with primary paths blocked!`,
        type: "warning",
        timestamp: timeString()
      }
    ]);

    await new Promise(r => setTimeout(r, 1000));

    // Agent 3: Strategist Dynamic Rerouting (Gemini 3.5 Flash)
    setAgentLogs(prev => [
      ...prev,
      {
        role: "Strategist",
        message: `[Gemini 3.5 Flash Optimizer] Initialised mitigation. Proposing general egress balance mapping. Stand overflow of affected sections redirected toward remaining open channels.`,
        type: "negotiate",
        timestamp: timeString()
      }
    ]);

    await new Promise(r => setTimeout(r, 700));

    // Sentinel critique rounds
    setAgentLogs(prev => [
      ...prev,
      {
        role: "Sentinel",
        message: `[Consensus Round 1 Reject] Risk audit failed! Blind routing increases crowd pressure at default gate exits. Collision index exceeds thresholds. Demand specialized routing bypasses.`,
        type: "warning",
        timestamp: timeString()
      }
    ]);

    await new Promise(r => setTimeout(r, 900));

    // Strategist final consensus
    const solvedAdjustments: Record<string, string> = {};
    if (baseDisabled.includes("Gate-4")) {
      solvedAdjustments["Gate-4"] = "Gate-2";
    } else if (baseDisabled.includes("Gate-1")) {
      solvedAdjustments["Gate-1"] = "Gate-3";
    } else {
      solvedAdjustments["Gate-2"] = "Gate-1";
    }

    setAgentLogs(prev => [
      ...prev,
      {
        role: "Strategist",
        message: `[Consensus Round 2 APPROVED] Rerouting protocol stabilized! Standard flow overrides: ${Object.entries(solvedAdjustments).map(([k, v]) => `${k} ➔ ${v}`).join(", ")}. Evacuation predicted to drop to ${Math.round(standardEvacTime * 0.42 * 10) / 10} mins under balanced conditions.`,
        type: "success",
        timestamp: timeString()
      }
    ]);

    await new Promise(r => setTimeout(r, 700));

    // Agent 4: Executor Activation
    setAgentLogs(prev => [
      ...prev,
      {
        role: "Executor",
        message: `[Canvas Deployment] Override commands sent to isometric pixel buffer. Dynamic safety markers active. Emissive vomitory pathways prioritized.`,
        type: "info",
        timestamp: timeString()
      }
    ]);

    // Dispatch webhook alarms
    setWebhookLogs([
      `[WEBHOOK] Dispatching staff.alert.evacuate to venue coordinators`,
      `[WEBHOOK] Broadcast navigation.override to stadium spectator app`,
      `[WEBHOOK] Activating physical green LEDs along designated vomitories`
    ]);

    setRoutingAdjustments(solvedAdjustments);
    setMitigationActive(true);
    setIsNegotiating(false);
  };

  // Generate real, fully structured Wankhede Stadium GLTF file content matching user specifications
  const getWankhedeGLTFString = () => {
    const gltf = {
      asset: {
        version: "2.0",
        generator: "IPL-Sentinel 3D Geometry Exporter"
      },
      scene: 0,
      scenes: [
        {
          name: "Wankhede Stadium Scene",
          nodes: [0, 1, 2, 3]
        }
      ],
      nodes: [
        { name: "Wankhede_SeatingBowls", children: [4, 5] },
        { name: "Wankhede_Concourses", children: [6] },
        { name: "Wankhede_Vomitories", children: [7] },
        { name: "Wankhede_EmergencyExits", children: [8] }
      ],
      meshes: [
        {
          name: "SeatingBowl_Mesh",
          primitives: [
            {
              attributes: { POSITION: 0, NORMAL: 1 },
              indices: 2,
              material: 0
            }
          ]
        },
        {
          name: "ConcourseHallways_Mesh",
          primitives: [
            {
              attributes: { POSITION: 3, NORMAL: 4 },
              indices: 5,
              material: 1
            }
          ]
        },
        {
          name: "Vomitories_Passages",
          primitives: [
            {
              attributes: { POSITION: 6 },
              indices: 7,
              material: 2
            }
          ]
        },
        {
          name: "EmergencyExits_Corridors",
          primitives: [
            {
              attributes: { POSITION: 8 },
              indices: 9,
              material: 3
            }
          ]
        }
      ],
      materials: [
        { name: "SteelSlate_Seats", pbrMetallicRoughness: { baseColorFactor: [0.12, 0.16, 0.22, 1.0], roughnessFactor: 0.65 } },
        { name: "WalkwayPassage", pbrMetallicRoughness: { baseColorFactor: [0.20, 0.22, 0.30, 1.0] } },
        { name: "VomitoryBeaconBlue", emissiveFactor: [0.1, 0.4, 0.9] },
        { name: "EmergencyGlowGreen", emissiveFactor: [0.0, 1.0, 0.4] }
      ]
    };
    return JSON.stringify(gltf, null, 2);
  };

  const getWankhedeOBJString = () => {
    return `# IPL-Sentinel 3D Wavefront OBJ Exporter\n# Wankhede Stadium Geometry\n# Center field at (0,0,0)\n\n` +
      `o SeatingBowl_Lower\n` +
      `v -50.0 0.0 -4.0\n` +
      `v 50.0 0.0 -4.0\n` +
      `v 0.0 40.0 -4.0\n` +
      `vn 0.0 1.0 0.0\n` +
      `f 1//1 2//1 3//1\n\n` +
      `o Concourses_Layout\n` +
      `v -62.0 0.0 0.0\n` +
      `v 62.0 0.0 0.0\n` +
      `v 0.0 62.0 0.0\n` +
      `f 4 5 6\n\n` +
      `o Vomitories_Tunnels\n` +
      `# 16 standard Wankhede egress points\n` +
      `v -38.0 20.0 1.5\n` +
      `v 38.0 20.0 1.5\n` +
      `v -20.0 38.0 1.5\n` +
      `v 20.0 38.0 1.5\n` +
      `f 7 8 9\n`;
  };

  const getWankhedePLYString = () => {
    return `ply\n` +
      `format ascii 1.0\n` +
      `comment Wankhede Stadium Geometry PLY\n` +
      `element vertex 6\n` +
      `property float x\n` +
      `property float y\n` +
      `property float z\n` +
      `element face 2\n` +
      `property list uchar int vertex_index\n` +
      `end_header\n` +
      `-50.0 0.0 -4.0\n` +
      `50.0 0.0 -4.0\n` +
      `0.0 40.0 -4.0\n` +
      `-62.0 0.0 0.0\n` +
      `62.0 0.0 0.0\n` +
      `0.0 62.0 0.0\n` +
      `3 0 1 2\n` +
      `3 3 4 5\n`;
  };

  const handleExportGeometry = () => {
    let content = "";
    let fileName = "";
    let mimeType = "";

    if (exportFormat === "GLTF") {
      content = getWankhedeGLTFString();
      fileName = "wankhede_geometry.gltf";
      mimeType = "application/json";
    } else if (exportFormat === "OBJ") {
      content = getWankhedeOBJString();
      fileName = "wankhede_geometry.obj";
      mimeType = "text/plain";
    } else {
      content = getWankhedePLYString();
      fileName = "wankhede_geometry.ply";
      mimeType = "text/plain";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeStadium = selectedStadium;

  const currentTheme = getStadiumTheme(selectedStadium?.id);

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col antialiased transition-all duration-700 font-sans"
      style={currentTheme.gradientStyle}
    >
      {/* HEADER BAR */}
      <header className="px-6 py-4 bg-slate-950/70 border-b border-white/5 backdrop-blur-md sticky top-0 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-400/20 rounded-xl relative overflow-hidden">
            <Shield className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div className="absolute inset-0 bg-indigo-500/10 scale-150 blur-lg rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white uppercase font-mono">
                IPL-Sentinel
              </h1>
              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 rounded text-[9px] font-bold font-mono">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Antigravity 2.0 Agentic Crowd Management & Dynamic Egress Command
            </p>
          </div>
        </div>

        {/* Stadium Selector dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" />
            <span>SELECT ARENA:</span>
          </label>
          <select 
            className="px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500 cursor-pointer min-w-[200px]"
            value={activeStadium?.id || ""}
            onChange={handleStadiumChange}
          >
            {stadiums.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>
          <button 
            onClick={resetSimulation}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 text-slate-300 active:scale-95"
            title="Clear active triggers"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>
      </header>

      {/* DYNAMIC ROLE UTILITY BAR & MATCH-TIME CONTROLLER */}
      <div className="max-w-7xl w-full mx-auto px-6 pt-6 flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* DUAL ROLE TAB CHANGER */}
        <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-indigo-400 font-extrabold tracking-wider uppercase">PORTAL INTERFACE USER ROLE</span>
            <span className="text-white text-xs font-mono font-bold">Switch between command and attendee portals</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <button
              onClick={() => setUserRole("admin")}
              className={`py-2 px-4 rounded-xl text-xs font-mono font-extrabold uppercase transition-all tracking-wide flex items-center justify-center gap-1.5 border cursor-pointer active:scale-95 ${
                userRole === "admin"
                  ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>COMMANDER ADMIN</span>
            </button>
            <button
              onClick={() => setUserRole("spectator")}
              className={`py-2 px-4 rounded-xl text-xs font-mono font-extrabold uppercase transition-all tracking-wide flex items-center justify-center gap-1.5 border cursor-pointer active:scale-95 ${
                userRole === "spectator"
                  ? "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>SPECTATOR APP</span>
            </button>
          </div>
        </div>

        {/* MATCH TIMELINE PREDICTIVE DRIVER */}
        <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex-[1.4] flex flex-col justify-between gap-2.5">
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span className="text-[10px] font-mono text-amber-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              LIVE MATCH EVENTS TIMELINE
            </span>
            <span className="text-[9px] text-slate-500 font-mono font-bold uppercase select-none">Calculates crowd predictions in real-time</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-[9px] font-mono">
            {[
              { id: "arrival", label: "Pre-Match", desc: "Gate heavy inflow" },
              { id: "powerplay", label: "Powerplay", desc: "Fans seated" },
              { id: "mid_break", label: "Break", desc: "Food crowd peak" },
              { id: "final_overs", label: "Final Overs", desc: "Early exits prep" },
              { id: "departure", label: "Concluded", desc: "Mass exit egress" }
            ].map((phaseItem) => (
              <button
                key={phaseItem.id}
                onClick={() => setMatchPhase(phaseItem.id as any)}
                className={`py-1.5 rounded-xl border text-center flex flex-col font-mono justify-center items-center gap-0.5 cursor-pointer transition-all active:scale-95 ${
                  matchPhase === phaseItem.id
                    ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.1)] font-bold font-mono"
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <span>{phaseItem.label}</span>
                <span className="text-[7px] tracking-tight opacity-60 font-sans hidden sm:inline leading-none font-medium mt-0.5">{phaseItem.desc}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* DASHBOARD CONTAINER */}
      {userRole === "admin" ? (
        !adminToken ? (
          <main className="flex-1 flex items-center justify-center p-6 max-w-lg w-full mx-auto">
            <form 
              onSubmit={handleAdminAuthLogin}
              className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-6 w-full relative overflow-hidden mt-12 mb-12"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col items-center gap-2 text-center pb-4 border-b border-white/5">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                  <Shield className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-white text-lg font-black tracking-wider uppercase mt-2">COMMANDER AUTHENTICATOR</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Access restricted to authorized IPL-Sentinel safety dispatch safety operators. Establish an encrypted session to continue.
                </p>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400 font-mono text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-extrabold">Commander Username</label>
                  <input 
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Enter admin ID"
                    required
                    className="bg-slate-900 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-extrabold">Override Passcode</label>
                  <input 
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter security passcode"
                    required
                    className="bg-slate-900 border border-white/10 rounded-xl py-2.5 px-4 text-xs font-mono text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col gap-1 text-center">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Authorized Developers Credentials</span>
                <span className="text-xs text-indigo-400 font-mono font-bold">admin / sentinel2026</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-mono font-extrabold uppercase transition-all tracking-wider shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-95"
              >
                ESTABLISH ENCRYPTED SESSION
              </button>
            </form>
          </main>
        ) : (
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: CRITICAL SPECS & CONFIGURATIONS */}
          <section className="flex flex-col gap-6">
            
            {/* VENUE MANIFEST STATS CARD */}
            {activeStadium && (
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] font-mono text-indigo-400 tracking-widest font-bold">VENUE SPECS</span>
                  <h3 className="text-white text-base font-extrabold uppercase mt-0.5">{activeStadium.name}</h3>
                </div>
                <div className="text-right text-[10px] font-mono text-slate-400">
                  <div>City: <span className="text-slate-200">{activeStadium.city}</span></div>
                  <div>Grid: <span className="text-indigo-400">{activeStadium.dimensions.length}x{activeStadium.dimensions.width}m</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-mono">SEATING CAPACITY</span>
                  <span className="text-lg font-black text-white mt-1">
                    {activeStadium.capacity.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5">Permitted density max</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-mono">ACTIVE EGRESS GATES</span>
                  <span className="text-lg font-black text-indigo-400 mt-1">
                    {activeStadium.gates.length}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5">Divertable exit nodes</span>
                </div>
              </div>

              {/* Stands breakdown miniature map indicators */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-400">STATIONS & STANDS LOAD MAP</span>
                <div className="grid grid-cols-4 gap-1">
                  {activeStadium.stands.map((stand, i) => (
                    <div 
                      key={i} 
                      className={`p-1 text-center rounded border text-[9px] font-mono select-none transition-all ${
                        activeThreat && activeThreat.toLowerCase().includes(stand.name.toLowerCase().split(" ")[0])
                          ? "bg-red-500/10 border-red-500/30 text-red-400 font-bold shadow-[0_0_8px_rgba(239,68,68,0.1)]"
                          : "bg-white/5 border-white/5 text-slate-400"
                      }`}
                      title={`${stand.name}: Capacity ${stand.capacity.toLocaleString()}`}
                    >
                      {stand.name.split(" ")[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADMIN PORTAL SECURITY & EMERGENCY BROADCAST CARD */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden border border-indigo-500/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-center border-b border-white/5 pb-3 font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-mono text-indigo-400 tracking-widest font-bold uppercase">ADMIN SECURITY OPERATIONS</span>
              </div>
              {adminToken ? (
                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 px-1.5 py-0.5 rounded font-mono font-bold leading-none">
                  AUTHORIZED
                </span>
              ) : (
                <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-400/20 px-1.5 py-0.5 rounded font-mono font-bold leading-none animate-pulse">
                  LOCKED OUT
                </span>
              )}
            </div>

            {!adminToken ? (
              /* Login credentials form */
              <form onSubmit={handleAdminAuthLogin} className="flex flex-col gap-3 font-mono">
                <p className="text-[10px] text-slate-400 leading-snug">
                  Enter operator passphrase credentials to establish encrypted socket channel & secure emergency dispatch permissions:
                </p>
                
                {authError && (
                  <div className="p-2 bg-red-950/40 border border-red-500/20 text-red-300 rounded text-[9px] leading-snug">
                    ⚠ {authError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <span className="text-[8px] text-slate-500 font-bold uppercase">OPERATOR ID</span>
                    <input 
                      type="text" 
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-lg text-[10px] text-white focus:outline-none focus:border-indigo-500"
                      placeholder="admin"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <span className="text-[8px] text-slate-500 font-bold uppercase">SECURE PASSCODE</span>
                    <input 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-900 border border-white/5 rounded-lg text-[10px] text-white focus:outline-none focus:border-indigo-500 font-sans"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold text-[10px] tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  ESTABLISH GATE OPERATIONS SYNC
                </button>
                <p className="text-[8px] text-slate-500 italic text-center">
                  Default developer passcode: <span className="font-bold select-all text-indigo-400">sentinel2026</span>
                </p>
              </form>
            ) : (
              /* Authenticated operator alert broadcaster panel */
              <form onSubmit={handleBroadcastEmergencyAlert} className="flex flex-col gap-3 font-mono border-t border-white/5 pt-1">
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center text-[10px]">
                  <div className="flex flex-col">
                    <span className="text-[8.5px] text-slate-400">ACTIVE SESSION ID:</span>
                    <span className="text-[9px] text-indigo-400 font-bold max-w-[140px] truncate">{adminToken}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdminAuthLogout}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-slate-400 hover:text-slate-200 text-[8.5px] font-bold cursor-pointer"
                  >
                    LOGOUT
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-slate-400 font-bold uppercase">EMERGENCY BROADCAST ALERT DESK:</span>
                  <textarea
                    value={targetBroadcastMsg}
                    onChange={(e) => setTargetBroadcastMsg(e.target.value)}
                    placeholder="e.g. Extreme bottleneck at Gate-3 detected. Spectators urged to detour to Gate 2!"
                    className="w-full h-16 p-2 bg-slate-900 border border-white/5 rounded-lg text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-mono leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] text-slate-500 font-bold uppercase">SEVERITY PRIORITY</span>
                    <select
                      value={targetBroadcastSeverity}
                      onChange={(e) => setTargetBroadcastSeverity(e.target.value)}
                      className="px-2 py-1.5 bg-slate-900 border border-white/5 rounded-lg text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="info">INFO (Advisory)</option>
                      <option value="warning">WARNING (Congest)</option>
                      <option value="critical">CRITICAL (Danger)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={broadcastProgress || !targetBroadcastMsg.trim()}
                    className="w-full h-9 mt-4 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg text-white font-bold text-[10px] tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Radio className="w-3 h-3 text-white animate-pulse" />
                    <span>{broadcastProgress ? "BROADCASTING..." : "DISPATCH"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* PARAMETERS CONFIGURATOR & SOCIAL PHYSICS */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Users className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">CROWD PHYSICS DYNAMICS</h3>
            </div>

            <div className="flex flex-col gap-4">
              {/* CROWD DENSITY TOGGLE */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">CROWD DENSITY</span>
                  <span className="text-emerald-400 font-bold uppercase">
                    {crowdDensity}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["low", "medium", "high"] as const).map((density) => (
                    <button
                      key={density}
                      onClick={() => setCrowdDensity(density)}
                      className={`py-1 rounded text-[10px] font-mono font-bold uppercase transition-all border ${
                        crowdDensity === density
                          ? "bg-emerald-500/15 border-emerald-400 text-emerald-300"
                          : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-500 font-mono italic leading-tight">
                  Updates active particles in-place (Low: 150, Med: 380, High: 750) without resetting status.
                </p>
              </div>

              {/* SIMULATION SPEED (FRAME INTERVAL THROTTLE) */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">SIMULATION SPEED (INTERVAL)</span>
                  <span className="text-indigo-400 font-bold">
                    {simulationSpeed === 0 ? "Max (60 FPS)" : `${simulationSpeed}ms Delay`}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="120"
                  step="10"
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold">
                  <span>Standard Fast</span>
                  <span>40ms</span>
                  <span>120ms (Chrono-Slow)</span>
                </div>
              </div>

              {/* SPEED MODIFIER */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">CROWD MOVEMENT VELOCITY</span>
                  <span className="text-emerald-400 font-bold">
                    {agentSpeedModifier}x
                  </span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={agentSpeedModifier}
                  onChange={(e) => setAgentSpeedModifier(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>Slow (0.5x)</span>
                  <span>Normal (1.0x)</span>
                  <span>Hyper/Panic (1.5x)</span>
                </div>
              </div>

              {/* GROUP SIZE */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">SOCIAL GROUP SIZE (CLUMPING)</span>
                  <span className="text-indigo-400 font-bold">
                    {groupSize} {groupSize === 1 ? "Fan" : "Fans"}
                  </span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>Individual (1)</span>
                  <span>Families (4)</span>
                  <span>Large Group Clump (10)</span>
                </div>
                <p className="text-[9px] text-slate-500 font-mono italic leading-tight">
                  Increasing group sizes assigns cohesive flocking forces. Remaining members wait for lagged/congested companions.
                </p>
              </div>
            </div>
          </div>

          {/* HAZARD/THREAT INJECTION ENGINE */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Zap className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">THREAT INJECTION</h3>
            </div>

            {/* Configured Quick-Inject Buttons */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono text-slate-500 tracking-wider">PRESET SCENARIOS</span>
              <button
                onClick={() => injectThreatPreset("gate_failure")}
                className="w-full text-left p-2.5 bg-red-950/20 border border-red-900/40 rounded-xl hover:bg-red-950/40 transition-all text-[11px] font-mono flex items-center gap-2 group cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-red-200 font-bold">Gate 4 Failure</div>
                  <div className="text-[9px] text-red-400/80">Disables Garware Stand exit routing</div>
                </div>
              </button>

              <button
                onClick={() => injectThreatPreset("stand_hazard")}
                className="w-full text-left p-2.5 bg-amber-950/20 border border-amber-900/40 rounded-xl hover:bg-amber-950/40 transition-all text-[11px] font-mono flex items-center gap-2 group cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-amber-200 font-bold">Stand B Local Incident</div>
                  <div className="text-[9px] text-amber-400/80">Bottlenecks exit flows around Section B</div>
                </div>
              </button>

              <button
                onClick={() => injectThreatPreset("flood_alert")}
                className="w-full text-left p-2.5 bg-indigo-950/20 border border-indigo-900/40 rounded-xl hover:bg-indigo-950/40 transition-all text-[11px] font-mono flex items-center gap-2 group cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <div className="text-indigo-200 font-bold">Outer West Flood Block</div>
                  <div className="text-[9px] text-indigo-400/80">Inundation locks major western perimeter Gate-1</div>
                </div>
              </button>
            </div>

            {/* Special custom query builder prompt */}
            <form onSubmit={handleManualThreatSubmit} className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <span className="text-[9px] font-mono text-slate-500 tracking-wider">MANUAL PROMPT INJECTOR</span>
              <div className="flex gap-1.5">
                <input 
                  type="text"
                  placeholder="Type e.g. Gate 4 alarm failure..."
                  className="flex-1 px-3 py-2 bg-slate-900/80 border border-white/5 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                  value={manualThreat}
                  onChange={(e) => setManualThreat(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!manualThreat.trim() || isNegotiating}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 hover:text-white transition-all rounded-xl cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </section>

        {/* MIDDLE COLUMN: INTUITIVE VIZ & METRICS TWIN */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          
          {/* TABS SELECT */}
          <div className="flex border-b border-white/5 gap-4">
            <button
              onClick={() => setActiveTab("visualizer")}
              className={`pb-2.5 text-xs font-mono tracking-wider font-extrabold uppercase transition-all relative ${
                activeTab === "visualizer" ? "text-white" : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <span>3D DIGITAL TWIN VIZ</span>
              {activeTab === "visualizer" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
            <button
              onClick={() => setActiveTab("cctv-feed")}
              className={`pb-2.5 text-xs font-mono tracking-wider font-extrabold uppercase transition-all relative ${
                activeTab === "cctv-feed" ? "text-white" : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-indigo-400" />
                <span>INTELLIGENT CCTV MATRIX</span>
              </span>
              {activeTab === "cctv-feed" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
            <button
              onClick={() => setActiveTab("gltf-exporter")}
              className={`pb-2.5 text-xs font-mono tracking-wider font-extrabold uppercase transition-all relative ${
                activeTab === "gltf-exporter" ? "text-white" : "text-slate-500 hover:text-slate-400"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>3D GEOMS & EXPORT</span>
              </span>
              {activeTab === "gltf-exporter" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
          </div>

          <div className="relative">
            {activeTab === "visualizer" ? (
              <div className="flex flex-col gap-6">
                
                {/* 3D PARTICLE CANVAS PANEL */}
                {activeStadium ? (
                  <ThreeJS_Visualizer 
                    stadium={activeStadium}
                    stadiumTheme={getStadiumTheme(activeStadium?.id)}
                    activeThreat={activeThreat}
                    disabledGates={disabledGates}
                    routingAdjustments={routingAdjustments}
                    mitigationActive={mitigationActive}
                    fanEvacuationProgress={fanEvacuationProgress}
                    setEvacuationProgress={setFanEvacuationProgress}
                    agentSpeedModifier={agentSpeedModifier}
                    groupSize={groupSize}
                    crowdDensity={crowdDensity}
                    simulationSpeed={simulationSpeed}
                  />
                ) : (
                  <div className="w-full h-[400px] bg-slate-900/30 rounded-2xl border border-white/5 flex items-center justify-center font-mono text-slate-500">
                    Loading stadium assets...
                  </div>
                )}

                {/* DOUBLE TIERS LIVE AGENT NEGOTIATOR TERMINAL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Dynamic Agent Negotiation Process Panel */}
                  <div className="md:col-span-2 glass-panel rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-sky-400 animate-pulse" />
                        <h4 className="text-xs font-extrabold text-white uppercase font-mono tracking-wider">
                          REAL-TIME AGENT NEGOTIATION DECODE
                        </h4>
                      </div>
                      
                      {isNegotiating && (
                        <span className="text-[9px] text-indigo-400 font-mono font-bold animate-pulse flex items-center gap-1">
                          ● PROCESSING DECISIONS
                        </span>
                      )}
                    </div>

                    <div className="h-[210px] overflow-y-auto flex flex-col gap-3 font-mono text-xs pr-1">
                      {agentLogs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
                          <span>No emergencies active. System running standard monitors.</span>
                          <span className="text-[10px] font-mono mt-1">Inject a threat to spark multi-agent negotiations</span>
                        </div>
                      ) : (
                        agentLogs.map((log, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                              log.type === "success" 
                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-200" 
                                : log.type === "warning"
                                ? "bg-red-500/5 border-red-500/20 text-red-200" 
                                : log.type === "negotiate"
                                ? "bg-amber-500/5 border-amber-500/20 text-amber-200"
                                : "bg-white/5 border-white/5 text-slate-300"
                            }`}
                          >
                            <div className="flex justify-between items-center text-[9px] font-bold border-b border-white/5 pb-1 mb-1">
                              <span className="flex items-center gap-1 uppercase tracking-wider">
                                <span className={`w-1 h-1 rounded-full ${
                                  log.role === "Librarian" ? "bg-blue-400" :
                                  log.role === "Sentinel" ? "bg-red-400" :
                                  log.role === "Strategist" ? "bg-amber-400" : "bg-emerald-400"
                                }`} />
                                {log.role} AGENT
                              </span>
                              <span className="text-slate-500">{log.timestamp}</span>
                            </div>
                            <p className="leading-relaxed text-[11px] font-sans text-slate-200">{log.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Emergency Webhook Logger dispatch output */}
                  <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-1.5 border-b border-white/5 pb-3">
                      <Radio className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                        DISPATCH WEBHOOKS
                      </h4>
                    </div>

                    <div className="h-[210px] overflow-y-auto flex flex-col gap-2 font-mono text-[10px] text-slate-400 pr-1">
                      {webhookLogs.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-600 italic">
                          Standby for dispatcher...
                        </div>
                      ) : (
                        webhookLogs.map((wLog, i) => (
                          <div key={i} className="p-2 bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 rounded-lg flex items-start gap-1.5 leading-tight">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{wLog}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* BRAND-NEW: CCTV CAMERA FEED INTEGRATION & CO-PILOT SPEECH SENTINEL */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 relative overflow-hidden border border-white/5">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                        <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white uppercase font-mono tracking-wide">
                          Live Gate Camera & voice copilot scanner
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Computer Vision Egress analysis with Google Text-to-Speech Advice Voice synthesis
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Speaker Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          setVoiceMuted(!voiceMuted);
                          if (!voiceMuted && window.speechSynthesis) {
                            window.speechSynthesis.cancel();
                          }
                        }}
                        className={`p-2 rounded-xl border font-mono text-xs transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                          !voiceMuted
                            ? "bg-indigo-500/10 border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/20"
                            : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                        title={voiceMuted ? "Unmute TTS" : "Mute TTS"}
                      >
                        {voiceMuted ? (
                          <>
                            <Zap className="w-3.5 h-3.5 text-slate-400" />
                            <span>MUTE VOICE</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                            <span>VOICE ACTIVE</span>
                          </>
                        )}
                      </button>

                      {/* CCTV Active Switcher */}
                      <button
                        type="button"
                        onClick={isCameraActive ? stopSentinelCCTV : startSentinelCCTV}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                          isCameraActive
                            ? "bg-red-500/15 border-red-500 text-red-200 hover:bg-red-500/25"
                            : "bg-blue-600 border-blue-500 text-white hover:bg-blue-500"
                        }`}
                      >
                        <span>{isCameraActive ? "SHUT DOWN CAM" : "INITIALIZE CAMERA"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                    
                    {/* CAMERA SCREEN AND LASER SCANNER BOX */}
                    <div className="md:col-span-5 bg-slate-950/90 rounded-xl overflow-hidden relative border border-white/10 h-[220px] flex items-center justify-center select-none">
                      {isCameraActive ? (
                        <div className="w-full h-full relative">
                          {/* Live Video Element */}
                          <video
                            ref={(el) => {
                              videoRef.current = el;
                              if (el && el.srcObject === null && isCameraActive) {
                                navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
                                  .then(s => { el.srcObject = s; el.play().catch(e => console.log(e)); })
                                  .catch(() => {});
                              }
                            }}
                            playsInline
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                          />

                          {/* Lasers, overlays and HUD signals */}
                          <div className="absolute inset-0 border border-indigo-500/20 pointer-events-none" />
                          
                          {/* Laser scanning strip */}
                          <div className="absolute left-0 right-0 h-0.5 bg-red-400/90 shadow-[0_0_10px_#f87171] opacity-70 animate-[bounce_4s_infinite]" />
                          
                          {/* Bounding box overlays */}
                          <div className="absolute top-1/4 left-1/3 w-28 h-20 border border-emerald-500/50 bg-emerald-500/5 rounded p-1">
                            <span className="text-[8px] font-mono text-emerald-400 block font-bold">CROWD_SECT</span>
                            <span className="text-[7px] font-mono text-slate-300 block">Density: 88%</span>
                          </div>

                          <div className="absolute bottom-6 right-6 w-20 h-14 border border-indigo-500/50 bg-indigo-500/5 rounded p-1">
                            <span className="text-[8px] font-mono text-indigo-300 block font-bold">SENTINEL_OK</span>
                            <span className="text-[7px] font-mono text-slate-300 block">FPS: 30.0</span>
                          </div>

                          {/* Cam corner grids */}
                          <div className="absolute top-2 left-2 text-[8px] font-mono text-red-500 tracking-wider flex items-center gap-1 bg-black/60 px-1 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                            <span>REC TEST_CAM_A</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500 font-mono gap-1.5">
                          <Radio className="w-8 h-8 text-slate-700 animate-pulse" />
                          <span className="text-xs font-bold text-slate-400">CAMERA STREAM STANDBY</span>
                          <span className="text-[10px] text-slate-600 max-w-[200px] leading-tight">
                            Click Initialise Camera to permit browser access or trigger local test-card emulator.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DYNAMIC ADVICE & SENTINEL AI FEED LOGS */}
                    <div className="md:col-span-7 flex flex-col justify-between gap-4">
                      
                      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex-1 flex flex-col gap-2 min-h-[140px] overflow-y-auto">
                        <span className="text-[9px] font-mono text-indigo-400 font-bold tracking-wider uppercase select-none flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                          CO-PILOT RESPONSE DECODE
                        </span>
                        
                        {isScanningCCTV ? (
                          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-mono">
                            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <span>Scanning live video matrices with neural network...</span>
                          </div>
                        ) : cameraAdvice ? (
                          <div className="flex flex-col gap-1.5 text-xs text-slate-300 leading-normal">
                            <p className="font-semibold text-white font-sans italic">
                              "{cameraAdvice}"
                            </p>
                            <div className="text-[9px] font-mono text-emerald-400 font-bold mt-1 flex items-center gap-1 select-none">
                              <span>✓ AUTOMATIC STAFF SMS SENT</span>
                              <span className="text-slate-500">|</span>
                              <span>✓ DIVERGENCE PATHS UNLOCKED</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-[11px] font-mono italic text-center py-4">
                            <span>Camera state idle. Enable camera feed and click Analyze below to trigger live mitigations.</span>
                          </div>
                        )}
                      </div>

                      {/* Action trigger button */}
                      <button
                        type="button"
                        onClick={triggerCCTVScanAndVoiceAdvice}
                        disabled={!isCameraActive || isScanningCCTV}
                        className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                          isCameraActive && !isScanningCCTV
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
                        }`}
                      >
                        <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
                        <span>ANALYZE CCTV FEED FOR THREATS</span>
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            ) : activeTab === "cctv-feed" ? (
              /* INTELLIGENT CCTV MATRIX SYSTEM SUB-PAGE */
              <div className="flex flex-col gap-6">
                
                {/* Upper description / overview bar */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-white text-base font-extrabold uppercase font-mono flex items-center gap-2">
                      <Camera className="w-5 h-5 text-indigo-400 animate-pulse" />
                      Intelligent CCTV Surveillance & Analytics Matrix
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Edge AI crowd diagnostics: tracking real-time bottlenecks and safety violations from digital RTSP surrogates
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[9px] px-3 py-1.5 bg-slate-900 rounded-lg border border-white/5 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-emerald-400 font-extrabold uppercase">STREAM SERVER LIVE IP: 10.240.18.42</span>
                  </div>
                </div>

                {/* Main grid of cameras + diagnostic details right hand helper */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* CCTV Monitor Grid Column (left 2 cols) */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: "CAM-01", desc: "North Gate Vomitory Focus", zoneOffset: 0, defaultFps: 30, baseDensity: 35 },
                      { id: "CAM-02", desc: "Pavilion Stairwell Entry", zoneOffset: 1, defaultFps: 29.9, baseDensity: 82 },
                      { id: "CAM-03", desc: "South Promenade Concourse", zoneOffset: 2, defaultFps: 30, baseDensity: 20 },
                      { id: "CAM-04", desc: "West General Egress Passage", zoneOffset: 3, defaultFps: 24, baseDensity: 62 }
                    ].map((cam, i) => {
                      const standName = selectedStadium?.stands[cam.zoneOffset % selectedStadium.stands.length]?.name || "Gate Corridor";
                      const isHigh = cam.baseDensity > 75 || (activeThreat && activeThreat.toLowerCase().includes(standName.split(" ")[0].toLowerCase()));
                      const densityPct = isHigh ? Math.min(100, cam.baseDensity + 15) : cam.baseDensity;

                      return (
                        <div 
                          key={cam.id} 
                          onClick={() => {
                            setSelectedCctvCamId(cam.id);
                            runNvidiaCctvScan(cam.id, cam.baseDensity, cam.desc);
                          }}
                          className={`relative glass-panel rounded-xl overflow-hidden aspect-video flex flex-col justify-between group border transition-all shadow-lg cursor-pointer ${
                            selectedCctvCamId === cam.id 
                              ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-slate-900/40" 
                              : "border-white/10 hover:border-indigo-500/30"
                          }`}
                        >
                          
                          {/* Inner simulated monitor overlay wrapper */}
                          <div className="absolute inset-0 bg-slate-950/20 pointer-events-none z-0" />
                          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 pointer-events-none" />
                          
                          {/* Scanlines Effect */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[length:100%_4px,_6px_100%] pointer-events-none" />
                           
                          {/* Header Stats Overlay */}
                          <div className="p-2 bg-gradient-to-b from-slate-950/90 to-transparent flex justify-between items-start z-10">
                            <div className="flex flex-col font-mono text-[9px]">
                              <span className="text-white font-bold flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? "bg-red-500 animate-ping" : "bg-emerald-400"}`} />
                                {cam.id}
                              </span>
                              <span className="text-slate-400 text-[8px] uppercase">{cam.desc}</span>
                            </div>
                            <span className="px-1.5 py-0.5 bg-black/80 rounded text-[8px] font-mono font-bold border border-white/5 text-slate-300 uppercase">
                              {standName.split(" ")[0]} Sector
                            </span>
                          </div>

                          {/* Center Screen: Interactive Mock Bounding Box Layout */}
                          <div className="flex-1 flex items-center justify-center relative p-4 pointer-events-none select-none">
                            
                            {/* Mock bounding box green or red tracking crowds */}
                            <div className={`absolute border-2 ${isHigh ? "border-red-500/60 bg-red-400/10 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse" : "border-emerald-500/30 bg-emerald-400/5"} rounded p-1.5 flex flex-col font-mono text-[8px] max-w-[120px]`} style={{ top: isHigh ? '20%' : '35%', left: isHigh ? '30%' : '15%' }}>
                              <span className={`font-bold ${isHigh ? "text-red-400 animate-bounce" : "text-emerald-400"}`}>
                                {isHigh ? "⚠ BOTTLENECK" : "👥 CROWD TRACK"}
                              </span>
                              <span className="text-slate-200">DENSITY: {densityPct}%</span>
                              <span className="text-slate-400 font-mono text-[7.5px]">FPS: {cam.defaultFps} | H.2.6.4</span>
                            </div>
                            
                            {/* Ambient static effect if high danger */}
                            {isHigh && (
                              <div className="absolute inset-0 bg-red-950/5 mix-blend-overlay pointer-events-none animate-pulse" />
                            )}
                          </div>

                          {/* Footer Controls & Live Metric overlay */}
                          <div className="p-2 bg-slate-950/90 border-t border-white/5 flex justify-between items-center z-10 text-[9px] font-mono">
                            <div className="flex gap-1.5">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Stream ${cam.id} hardware metrics:\\n- RTSP Transport Protocol: UDP Bypass\\n- Current latency: 12ms\\n- Hardware thermal boundaries: 42°C (OK)`);
                                }}
                                className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-slate-300 font-bold tracking-tight cursor-pointer active:scale-95"
                              >
                                DIAGS
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Triggering capture frame restart for: ${cam.id}. Sync achieved.`);
                                }}
                                className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-slate-300 font-bold tracking-tight cursor-pointer flex items-center gap-1 active:scale-95"
                              >
                                <RefreshCw className="w-2.5 h-2.5 text-slate-400" />
                                BOOT
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  runNvidiaCctvScan(cam.id, densityPct, cam.desc);
                                }}
                                disabled={isNvidiaScanning}
                                className={`px-2.5 py-0.5 rounded border font-extrabold uppercase flex items-center gap-1 transition-all cursor-pointer active:scale-95 disabled:opacity-40 ${
                                  selectedCctvCamId === cam.id
                                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-black animate-pulse"
                                    : "bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400"
                                }`}
                              >
                                <Zap className="w-2.5 h-2.5 text-emerald-400" />
                                {isNvidiaScanning && selectedCctvCamId === cam.id ? "ANALYZING..." : "NVIDIA SCAN"}
                              </button>
                            </div>

                            <span className={`font-bold ${isHigh ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                              {densityPct}% CAP ({isHigh ? "CRITICAL" : "STABLE"})
                            </span>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* Right Hand Diagnostics & Enterprise Readiness Side Column */}
                  <div className="flex flex-col gap-4">
                    
                    {/* Live Stream controller hardware desk panel */}
                    <div className="glass-panel rounded-xl p-4 flex flex-col gap-3 font-mono border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                      <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 font-mono">
                        <Sliders className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">NVIDIA NIM EDGE HEADCOUNTER</span>
                      </div>
                      
                      <div className="flex flex-col gap-2.5 text-[10px] font-mono">
                        <div className="flex justify-between items-center text-slate-400 pb-1.5 border-b border-white/5">
                          <span>ACTIVE SCANNING STREAM:</span>
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded font-bold">{selectedCctvCamId}</span>
                        </div>

                        {/* Nvidia scan results representation */}
                        <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex flex-col gap-2 relative">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                            <span className="text-[8px] text-slate-500 font-bold uppercase">NVIDIA NIM ANALYSIS CARRIER</span>
                            <span className="text-[8.5px] text-indigo-400 font-bold">100% ONLINE</span>
                          </div>

                          <div className="flex items-baseline justify-between mt-1">
                            <span className="text-slate-400">Detected Headcount:</span>
                            <span className="text-base font-black text-white tracking-tight">
                              {isNvidiaScanning ? "SCANNING..." : `${nvidiaScanResult?.peopleCount || 142} Spectators`}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[9px] text-slate-400">
                            <span>Congestion Level:</span>
                            <span className={`font-extrabold px-1.5 py-0.2 rounded text-[8.5px] ${
                              nvidiaScanResult?.congestionLevel === "CRITICAL"
                                ? "bg-red-500/10 text-red-400 border border-red-500/25"
                                : nvidiaScanResult?.congestionLevel === "HIGH"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            }`}>
                              {nvidiaScanResult?.congestionLevel || "MODERATE"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[8.5px] text-slate-500">
                            <span>NIM Diagnostic Model:</span>
                            <span className="font-bold text-slate-300">{nvidiaScanResult?.realNvidiaNim ? "Llama-3.1-8B-Vision (NIM)" : "PeopleNet Edge-Surrogate"}</span>
                          </div>

                          <div className="flex justify-between items-center text-[8.5px] text-slate-500">
                            <span>Processing Delay Rate:</span>
                            <span className="text-indigo-400 font-mono tracking-tight font-bold">{nvidiaScanResult?.latencyTicksMs || 12}ms</span>
                          </div>

                          {nvidiaScanResult?.remedy && (
                            <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-indigo-300 leading-snug">
                              <span className="text-slate-500 font-bold block uppercase text-[7.5px] mb-0.5">Corrective Action Guidance</span>
                              {nvidiaScanResult.remedy}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Interactive Manual Edge Scan */}
                      <button
                        onClick={() => {
                          const cameraData = [
                            { id: "CAM-01", desc: "North Gate Vomitory Focus", baseDensity: 35 },
                            { id: "CAM-02", desc: "Pavilion Stairwell Entry", baseDensity: 82 },
                            { id: "CAM-03", desc: "South Promenade Concourse", baseDensity: 20 },
                            { id: "CAM-04", desc: "West General Egress Passage", baseDensity: 62 }
                          ].find(c => c.id === selectedCctvCamId) || { id: "CAM-01", desc: "North Gate Vomitory Focus", baseDensity: 35 };

                          runNvidiaCctvScan(selectedCctvCamId, cameraData.baseDensity, cameraData.desc);
                        }}
                        disabled={isNvidiaScanning}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg text-white font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-1.5 font-mono"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-white ${isNvidiaScanning ? "animate-spin" : ""}`} />
                        <span>{isNvidiaScanning ? "COMPUTING AI PASS..." : "RE-SCAN CCTV VIA NVIDIA NIM"}</span>
                      </button>
                    </div>

                    {/* ENTERPRISE INTEG PANE */}
                    <div className="glass-panel rounded-xl p-4 flex flex-col gap-3 font-mono">
                      <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">DEPLOYMENT SPECIFICATION</span>
                      </div>

                      <p className="text-[9px] text-slate-400 leading-normal">
                        To connect real camera surveillance networks, configure the RTSP gateway mapping parameters within the environment variable secrets:
                      </p>

                      <div className="bg-slate-900 border border-white/10 rounded-lg p-2 font-mono text-[8px] text-indigo-300 leading-snug flex flex-col gap-1 select-all select-none">
                        <div>CCTV_GATEWAY_URL=rtsp://admin:cred@cctv:554/ch1</div>
                        <div>SURVEILLANCE_FPS_MIN=24</div>
                        <div>EDGE_ANALYTICS_MODEL=yolov8x_ipl.pt</div>
                        <div>RTSP_CODEC_MUX=webrtc-bypass</div>
                      </div>

                      <p className="text-[8.5px] text-slate-500 italic leading-snug">
                        Edge streams support H.264 video streams directly multiplexed into WebRTC canvas layers via simple proxy agents. Ready for robust production deployment.
                      </p>
                    </div>

                    {/* DYNAMIC OCR EMBEDDED NEURAL MODEL DETECTOR PANEL */}
                    <div className="glass-panel rounded-xl p-4 flex flex-col gap-3 font-mono border border-emerald-500/10">
                      <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <Camera className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">GATE OCR MODEL EMBEDDING</span>
                        <span className="text-[7.5px] bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 px-1 py-0.2 rounded font-sans leading-none uppercase ml-auto">v4.1</span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-[9px]">
                        <span className="text-slate-400">OCR RECOGNITION TERMINAL STATUS:</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-900 p-2 border border-white/5 rounded-lg flex flex-col">
                            <span className="text-[8px] text-slate-500 uppercase font-bold">TOTAL GATE HEADCOUNT</span>
                            <span className="text-sm font-black text-white mt-0.5">{ocrHeadcount}</span>
                          </div>
                          <div className="bg-slate-900 p-2 border border-white/5 rounded-lg flex flex-col">
                            <span className="text-[8px] text-slate-500 uppercase font-bold">ML OCR ACCURACY RATIO</span>
                            <span className="text-sm font-black text-emerald-400 mt-0.5">99.42%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">REAL-TIME TICKET OCR SCAN VECTOR CORRIDOR</span>
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5 h-[120px] overflow-y-auto flex flex-col gap-1.5 font-mono text-[8px] leading-tight pr-1.5 select-none text-slate-300">
                          {ocrEntries.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white/[0.02] p-1.5 rounded border border-white/5 transition-all">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-emerald-400">{item.ticketId}</span>
                                <span className="text-slate-500">Gate: {item.gate} • {item.timestamp}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-[7px] text-slate-400">Headcount: {item.crowdEst}</span>
                                <span className={`text-[7px] font-bold ${item.status === "OUTFLOW_SURGE" ? "text-red-400" : "text-emerald-400"}`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-[8px] text-slate-500 italic leading-snug">
                        💡 YOLOv8 models analyze optical character bounds on spectator tickets matching stadium ingress/egress tickets. This allows automated crowds estimation without any physical trackers.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              // 3D GEOMETRY DESCRIPTION & FORMATTED EXPORTER FOR WANKHEDE
              <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-white text-base font-extrabold uppercase font-mono">
                      Wankhede Stadium 3D Geometries Exporter
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Export high definition stadium polygons & egress landmarks in GLTF, OBJ, or PLY formats
                    </p>
                  </div>
                  
                  {/* Selector & Download Trigger Row */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Format:</span>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value as "GLTF" | "OBJ" | "PLY")}
                        className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-xs text-indigo-300 font-bold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="GLTF">GLTF Standard</option>
                        <option value="OBJ">Wavefront OBJ</option>
                        <option value="PLY">Stanford PLY</option>
                      </select>
                    </div>

                    <button
                      onClick={handleExportGeometry}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 font-mono text-xs font-extrabold text-white rounded-xl flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>EXPORT {exportFormat}</span>
                    </button>
                  </div>
                </div>

                {/* Subdivided geometry specifications inside Wankhede */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-extrabold font-mono tracking-wider text-indigo-400 uppercase">
                      STADIUM DESIGN SCHEMATICS
                    </h4>

                    <div className="flex flex-col gap-3">
                      {/* Seating bowls spec */}
                      <div className="bg-white/5 p-4 border border-white/5 rounded-xl flex flex-col gap-1">
                        <span className="text-xs text-white font-extrabold flex items-center gap-1.5 uppercase font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          1. Seating Bowls Tiering
                        </span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Divided structurally into Lower Seating Tier (Z: 2m-4m, radius scale 0.35) and Upper Seating Bowl (Z: 14m-22m, radius scale 0.55). Models individual fan anchor coordinates perfectly.
                        </p>
                      </div>

                      {/* Concourse Walkways shape */}
                      <div className="bg-white/5 p-4 border border-white/5 rounded-xl flex flex-col gap-1">
                        <span className="text-xs text-white font-extrabold flex items-center gap-1.5 uppercase font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          2. Concourse Circulation Hallways
                        </span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Outer spatial loop (concourseRadiusX: limits * 0.62) where spectators gather, transition stand entrances, and disperse toward exits. Bridges static exit corridors to the seating zones.
                        </p>
                      </div>

                      {/* Vomitories specifications */}
                      <div className="bg-white/5 p-4 border border-white/5 rounded-xl flex flex-col gap-1">
                        <span className="text-xs text-white font-extrabold flex items-center gap-1.5 uppercase font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          3. Vomitory Portals (16 Points)
                        </span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          16 designated radial tunnel doors linking interior seat lines straight to concourse corridors. Each stand center angle correlates with precise exit points to map evacuation rates correctly.
                        </p>
                      </div>

                      {/* Emergency Exits description */}
                      <div className="bg-white/5 p-4 border border-white/5 rounded-xl flex flex-col gap-1">
                        <span className="text-xs text-white font-extrabold flex items-center gap-1.5 uppercase font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          4. Emergency Escape Exits
                        </span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          High performance green LED escape channels mapping direct, rapid exit lines to Vinoo Mankad Gate, Garware Gate, and Sunil Gavaskar boundary exits. Highlighted on active threat alerts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Live Dynamic Scene Descriptor Previewer */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold font-mono tracking-wider text-emerald-400 uppercase">
                      {exportFormat} MODEL STRUCTURAL PREVIEW
                    </h4>

                    <div className="bg-slate-900 border border-white/5 rounded-xl p-4 h-[380px] overflow-auto font-mono text-[10px] text-slate-300 leading-relaxed pr-2">
                      <pre className="whitespace-pre-wrap select-all">
                        {exportFormat === "GLTF"
                          ? getWankhedeGLTFString()
                          : exportFormat === "OBJ"
                          ? getWankhedeOBJString()
                          : getWankhedePLYString()}
                      </pre>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono italic">
                      💡 Click anywhere on the structure block to select all text, or select a file format dropdown and click Export {exportFormat} to save.
                    </span>
                  </div>

                </div>

              </div>
            )}
          </div>

        </section>

          </main>
        )
      ) : (
        /* ==================== SPECTATOR APP INTERFACE ==================== */
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fade-in font-sans">
          
          {/* Welcome and Alert Announcement banner */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-emerald-500/10">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white text-base font-extrabold uppercase font-mono">
                  Spectator Safe Evacuation & Crowd-Avoidance System
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Live Companion: Optimizing your attendee experience with real-time crowd safety telemetry and offline routing guards.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">BATTERY SAVER (SUSTAINABILITY):</span>
              <button
                onClick={() => setScalabilitySaver(!scalabilitySaver)}
                className={`px-3 py-1.5 rounded-xl border text-[9px] font-mono font-bold uppercase transition-all active:scale-95 cursor-pointer ${
                  scalabilitySaver
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    : "bg-white/5 border-white/15 text-slate-400 hover:text-slate-300"
                }`}
                title="Reduces client CPU/battery usage and static queries overhead for N users"
              >
                {scalabilitySaver ? "SAVER ACTIVE ✓" : "SAVER OFF"}
              </button>
            </div>
          </div>

          {/* ACTIVE DISPATCHED EMERGENCY BROADCASTS (REAL-TIME FROM ADMIN) */}
          {polledNotifications && polledNotifications.length > 0 && polledNotifications.some(n => n.id !== "NOTIF-INITIAL-1") && (
            <div className="flex flex-col gap-3">
              {polledNotifications.filter(n => n.id !== "NOTIF-INITIAL-1").map((notif, i) => (
                <div 
                  key={notif.id || i}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 relative overflow-hidden animate-pulse shadow-xl ${
                    notif.type === "danger" || notif.type === "critical"
                      ? "bg-red-500/10 border-red-500/30 text-red-100 shadow-red-500/5"
                      : notif.type === "warning"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-100 shadow-amber-500/5"
                      : notif.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-100 shadow-emerald-500/5"
                      : "bg-indigo-500/10 border-indigo-500/20 text-indigo-100 shadow-indigo-500/5"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    notif.type === "danger" || notif.type === "critical"
                      ? "bg-red-500/20 border-red-500/30 text-red-400"
                      : notif.type === "warning"
                      ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                      : notif.type === "success"
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                  }`}>
                    <AlertTriangle className="w-5 h-5 animate-bounce" />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <span className="text-[9px] font-mono font-black uppercase tracking-widest block opacity-75">
                        🚨 EMERGENCY COMMAND CENTRE INCIDENT REPORT • {notif.timestamp}
                      </span>
                      <p className="text-xs font-semibold mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-extrabold px-3 py-1 rounded-xl bg-black/40 border border-white/5 tracking-wider self-start sm:self-auto uppercase">
                      {notif.type || "ALERT"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: INTERACTIVE CROWD-SAFE ROUTINE BUILDER (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* MAIN PLANNING PLATFORM */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-2 border-b border-white/5 pb-3.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-extrabold text-white uppercase font-mono tracking-wider">
                    AI Egress Routing Portal
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Stand */}
                  <div className="flex flex-col gap-1.5 font-mono">
                    <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      1. MATCH TICKET SECTOR / STAND:
                    </label>
                    <select
                      value={spectatorStand}
                      onChange={(e) => setSpectatorStand(e.target.value)}
                      className="px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {selectedStadium?.stands.map(stand => (
                        <option key={stand.name} value={stand.name}>{stand.name}</option>
                      )) || (
                        <>
                          <option value="Garware Stand">Garware Stand</option>
                          <option value="Sunil Gavaskar Stand">Sunil Gavaskar Stand</option>
                          <option value="Sachin Tendulkar Stand">Sachin Tendulkar Stand</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Select Target Gate / Destination */}
                  <div className="flex flex-col gap-1.5 font-mono">
                    <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      2. DESIRED OUTBOUND HUB:
                    </label>
                    <select
                      value={spectatorDestination}
                      onChange={(e) => setSpectatorDestination(e.target.value)}
                      className="px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Vinoo Mankad Gate-2">Vinoo Mankad Gate-2 (North-East)</option>
                      <option value="Garware Gate-3">Garware Gate-3 (South-West)</option>
                      <option value="Sunil Gavaskar Gate-4">Sunil Gavaskar Gate-4 (North-West)</option>
                      <option value="Churchgate Train Station">Churchgate Local Train Station Terminal</option>
                      <option value="Marine Drive Transit Link">Marine Drive Shuttle & Taxi Hub</option>
                    </select>
                  </div>
                </div>

                {/* CALCULATED AI CROWD BYPASS ROUTE DIRECTIONS */}
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 flex flex-col gap-3 font-mono mt-2">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-[10px] uppercase font-bold text-slate-300">
                    <span className="text-emerald-400">OPTIMAL CROWD-SAFE EVAC DIRECTIONS</span>
                    <span className="text-indigo-300 text-[8.5px]">RE-SAMPLED 1s AGO</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {(() => {
                      const instructions = [
                        `Leave your seats in ${spectatorStand} through the nearest low-occupancy stairs.`,
                        `Walk clockwise along the outer concourse loop - strictly bypassing food concessions and high congestion regions.`,
                        `Head to the secure evacuation gates of ${spectatorDestination} for instant, bottleneck-free egress.`
                      ];
                      return instructions.map((step, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 text-[9px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ));
                    })()}
                  </div>

                  <div className="text-[8.5px] text-slate-500 italic border-t border-white/5 pt-2 flex justify-between items-center">
                    <span>* Warning: Garware Gate-4 is currently locked due to emergency simulations. Avoid other exits!</span>
                  </div>
                </div>

                {/* INTERACTIVE CONTROLS ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <button
                    onClick={() => {
                      if (!voiceMuted && window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(
                          `Safe escape route generated. First, leave ${spectatorStand} via the lowest level exits. Avoid internal concession lines, and head clockwise towards ${spectatorDestination} for congestion-free passage. Safety confirmed.`
                        );
                        utterance.rate = 1.0;
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-mono font-bold tracking-wide transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
                    <span>AUDIO EGRESS CO-PILOT</span>
                  </button>

                  <button
                    onClick={handleSaveOfflinePlan}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-wide transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    <Download className="w-4 h-4 text-emerald-200" />
                    <span>{offlineReceiptSaved ? "SAVED OFFLINE ✓" : "SAVE OFFLINE SAFETY CARD"}</span>
                  </button>
                </div>

              </div>

              {/* CONCONCESSIONS AND STALL BALANCER (BASED ON MATCH TIME PLAY) */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/10">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-extrabold text-white uppercase font-mono tracking-wider">
                      Refreshments & Restrooms Crowd Balancer
                    </h4>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-slate-900 rounded border border-white/5 text-amber-300 font-mono">
                    EVENT PHASE: {matchPhase.toUpperCase()}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono -mt-1 leading-normal">
                  Avoid long interval delays. Real-time sensor grids indicate concessions queue density based on stadium crowd movement patterns:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5 font-mono text-[10px]">
                  {getConcessionQueues(matchPhase).map((con, idx) => {
                    const isCongested = con.status === "CRITICAL" || con.status === "WARNING";
                    return (
                      <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1.5">
                        <div className="flex justify-between text-slate-300">
                          <span className="font-bold truncate max-w-[150px]">{con.name}</span>
                          <span className={`text-[9px] font-bold ${isCongested ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                            {con.status}
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1 relative overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isCongested ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} 
                            style={{ width: `${con.val}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-[8px] text-slate-400">
                          <span>Queue wait: {con.load}</span>
                          <span className="font-bold">{con.val}% cap</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* COLUMN 2: GATES OVERFLOW & PERSISTED SAFE CARDS (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* LIVE QUEUE GATES DECODE METRIC */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/10 font-mono">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    LIVE EXIT GATES QUEUE WAIT:
                  </span>
                  <span className="text-[8.5px] text-slate-500 select-none">UPDATE RATE: 4s</span>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { node: "Gate-1", delay: 3, capacity: 25, label: "Vinoo Mankad West Exit" },
                    { node: "Gate-2", delay: 1, capacity: 11, label: "Vinoo Mankad East Bypass" },
                    { node: "Gate-3", delay: 9, capacity: 58, label: "Garware South Loop" },
                    { node: "Gate-4", delay: 28, capacity: 96, label: "Garware North Vomit Corridor" },
                  ].map((gateItem, idx) => {
                    const isClosed = disabledGates.includes(gateItem.node);
                    const isHeavy = gateItem.delay > 15;
                    return (
                      <div key={idx} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between gap-3 text-xs">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{gateItem.node}</span>
                          <span className="text-[9px] text-slate-500">{gateItem.label}</span>
                        </div>

                        <div className="text-right">
                          {isClosed ? (
                            <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-bold uppercase text-[8px]">
                              ⚠ CLOSED SPEC
                            </span>
                          ) : (
                            <div className="flex flex-col items-end">
                              <span className={`font-bold ${isHeavy ? "text-red-400" : "text-emerald-400"}`}>
                                {gateItem.delay} MIN WAIT
                              </span>
                              <span className="text-[8.5px] text-slate-400 uppercase">{gateItem.capacity}% capacity</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OFFLINE PERSISTED ROUTES LEDGER */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/10 font-mono">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    OFFLINE PERSISTED SAFETY KEYS
                  </span>
                  {savedOfflineRoutes.length > 0 && (
                    <button
                      onClick={() => {
                        localStorage.removeItem("ipl_offline_routes");
                        setSavedOfflineRoutes([]);
                      }}
                      className="text-[9.5px] text-red-400 hover:text-red-300 underline font-bold cursor-pointer transition-colors"
                    >
                      CLEAR CARDS
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  In case of cell tower failure, these pre-rendered route files remain loaded in your browser local storage database for immediate emergency egress visual guidance.
                </p>

                {savedOfflineRoutes.length === 0 ? (
                  <div className="p-4 bg-slate-900/30 rounded-xl border border-white/5 text-center text-[10px] text-slate-500 italic">
                    No offline routes saved yet. Pick stand/gate above and tap "Save Offline Safety Card".
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                    {savedOfflineRoutes.map((savedPlan) => (
                      <div key={savedPlan.id} className="p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[9.5px] flex justify-between items-center text-slate-300">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-white text-[10px] uppercase">{savedPlan.id} • SAFE KEY</span>
                          <span>From: {savedPlan.stand}</span>
                          <span>To: {savedPlan.gate}</span>
                        </div>
                        <span className="text-[9.5px] text-emerald-400 font-bold">{savedPlan.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </main>
      )}

      {/* FOOTER */}
      <footer className="mt-12 py-4 px-6 border-t border-white/5 bg-black/60 backdrop-blur-md text-center text-[10px] font-mono text-slate-500">
        IPL-Sentinel C&C System | Powered by Antigravity 2.0 with NVIDIA NIM crowd physics & Google Gemini 3.5 Flash content generators
      </footer>
    </div>
  );
}
