"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type AnalysisPhase, ANALYSIS_PHASE_MESSAGES } from "@/lib/types";
import { Loader2, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanningAnimationProps {
  phase: AnalysisPhase;
  progress: number;
}

const phaseOrder: AnalysisPhase[] = [
  "validating",
  "fetching_website",
  "fetching_social",
  "analyzing_voice",
  "detecting_tone",
  "calculating_cohesion",
  "generating_verdict",
];

const phaseLabels: Record<string, string> = {
  validating: "Validating",
  fetching_website: "Reading Website",
  fetching_social: "Reading Social",
  analyzing_voice: "Analyzing Voice",
  detecting_tone: "Detecting Tone",
  calculating_cohesion: "Calculating",
  generating_verdict: "Writing Report",
};

export function ScanningAnimation({ phase, progress }: ScanningAnimationProps) {
  if (phase === "idle" || phase === "complete") return null;

  const currentPhaseIndex = phaseOrder.indexOf(phase);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-stone-200 rounded-sm p-12 text-center shadow-editorial"
    >
      {/* Loading indicator */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-8"
      >
        <Loader2 className="h-8 w-8 text-green-800" />
      </motion.div>

      {/* Status message */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-serif font-semibold text-zinc-900 mb-4"
        >
          {ANALYSIS_PHASE_MESSAGES[phase]}
        </motion.h2>
      </AnimatePresence>

      <p className="text-stone-500 text-sm mb-10">
        This may take a moment
      </p>

      {/* Progress bar */}
      <div className="relative h-1 bg-stone-100 rounded-full overflow-hidden mb-10 max-w-xs mx-auto">
        <motion.div
          className="absolute inset-y-0 left-0 bg-green-800 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Phase checklist */}
      <div className="flex flex-wrap justify-center gap-3">
        {phaseOrder.map((p, index) => {
          const isCompleted = index < currentPhaseIndex;
          const isCurrent = index === currentPhaseIndex;

          return (
            <motion.div
              key={p}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs
                ${isCompleted 
                  ? "bg-stone-100 text-green-800" 
                  : isCurrent 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-stone-50 text-stone-400"
                }
              `}
            >
              {isCompleted && <Check className="h-3 w-3" />}
              {isCurrent && (
                <motion.div
                  className="w-1.5 h-1.5 bg-green-800 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              <span>{phaseLabels[p]}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Skeleton preview */}
      <div className="mt-12 pt-8 border-t border-stone-100">
        <div className="space-y-3 max-w-sm mx-auto">
          <div className="skeleton-editorial h-4 w-3/4 rounded-sm" />
          <div className="skeleton-editorial h-4 w-1/2 rounded-sm" />
          <div className="skeleton-editorial h-4 w-2/3 rounded-sm" />
        </div>
      </div>
    </motion.div>
  );
}

// Error state component
interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-stone-200 rounded-sm p-12 text-center shadow-editorial"
    >
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-2xl font-serif font-semibold text-zinc-900 mb-3">
        Something went wrong
      </h3>
      <p className="text-stone-500 mb-8 max-w-sm mx-auto">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
}

// Skeleton components
export function SkeletonCard() {
  return (
    <div className="bg-white border border-stone-200 rounded-sm p-10 shadow-editorial">
      <div className="space-y-4">
        <div className="skeleton-editorial h-6 w-1/3 rounded-sm" />
        <div className="skeleton-editorial h-4 w-2/3 rounded-sm" />
        <div className="skeleton-editorial h-40 w-full rounded-sm mt-6" />
      </div>
    </div>
  );
}