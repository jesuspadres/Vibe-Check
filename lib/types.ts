// Brand Compass Axis Types
export interface BrandAxisData {
  axis: string;
  website: number;
  social: number;
  fullMark: 100;
}

// Loading states for the analysis process
export type AnalysisPhase =
  | "idle"
  | "validating"
  | "fetching_website"
  | "fetching_social"
  | "analyzing_voice"
  | "detecting_tone"
  | "calculating_cohesion"
  | "generating_verdict"
  | "complete"
  | "error";

export interface AnalysisStatus {
  phase: AnalysisPhase;
  message: string;
  progress: number; // 0-100
}

// Analysis phase messages for the loading animation
export const ANALYSIS_PHASE_MESSAGES: Record<AnalysisPhase, string> = {
  idle: "Ready to analyze",
  validating: "Validating inputs...",
  fetching_website: "Scanning website DNA...",
  fetching_social: "Intercepting social signals...",
  analyzing_voice: "Decoding brand voice patterns...",
  detecting_tone: "Detecting sarcasm levels... 🔍",
  calculating_cohesion: "Computing cohesion matrix...",
  generating_verdict: "Generating personality verdict...",
  complete: "Analysis complete!",
  error: "Analysis failed",
};

// Radar chart configuration
export interface RadarChartConfig {
  dataKey: string;
  stroke: string;
  fill: string;
  fillOpacity: number;
  name: string;
}

// Form state interface
export interface AuditFormState {
  websiteUrl: string;
  socialHandle: string;
  socialPlatform: "twitter" | "instagram";
  isSubmitting: boolean;
  errors: {
    websiteUrl?: string;
    socialHandle?: string;
    socialPlatform?: string;
    general?: string;
  };
}

// API request/response types
export interface AuditApiRequest {
  websiteUrl: string;
  socialHandle: string;
  socialPlatform: "twitter" | "instagram";
}

export interface AuditApiResponse {
  success: boolean;
  data?: import("./validation").BrandAnalysisResult;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

// Cohesion score interpretation
export interface CohesionInterpretation {
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export function interpretCohesionScore(score: number): CohesionInterpretation {
  if (score >= 90) {
    return {
      label: "Brand Soulmates",
      emoji: "🔥",
      color: "text-emerald-400",
      description: "Your brand voice is remarkably consistent across platforms. Chef's kiss!",
    };
  }
  if (score >= 75) {
    return {
      label: "Harmonious",
      emoji: "✨",
      color: "text-cyan-400",
      description: "Strong alignment with minor variations. Your brand identity shines through.",
    };
  }
  if (score >= 60) {
    return {
      label: "Mostly Aligned",
      emoji: "👍",
      color: "text-amber-400",
      description: "Good foundation with room for tightening. Consider unifying tone across channels.",
    };
  }
  if (score >= 40) {
    return {
      label: "Split Personality",
      emoji: "🎭",
      color: "text-orange-400",
      description: "Noticeable differences between platforms. Your audience might be confused.",
    };
  }
  return {
    label: "Identity Crisis",
    emoji: "😵‍💫",
    color: "text-red-400",
    description: "Major disconnect between your website and social presence. Time for a brand therapy session.",
  };
}

// Axis labels for display
export const AXIS_LABELS = {
  professionalCasual: {
    low: "Professional",
    high: "Casual",
    description: "Formality level of communication",
  },
  seriousWitty: {
    low: "Serious",
    high: "Witty",
    description: "Use of humor and playfulness",
  },
  modernTraditional: {
    low: "Modern",
    high: "Traditional",
    description: "Contemporary vs. classic positioning",
  },
  directEmotive: {
    low: "Direct",
    high: "Emotive",
    description: "Factual vs. emotional appeal",
  },
} as const;
