"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type AnalysisPhase, ANALYSIS_PHASE_MESSAGES } from "@/lib/types";
import { Loader2, Check, AlertCircle } from "lucide-react";

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

export function ScanningAnimation({ phase, progress }: ScanningAnimationProps) {
  if (phase === "idle" || phase === "complete") return null;

  const currentPhaseIndex = phaseOrder.indexOf(phase);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative glass-card p-8 overflow-hidden"
    >
      {/* Scanning line animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          animate={{
            y: [-100, 400],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Main status */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-6 w-6 text-cyan-400" />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.h3
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl font-semibold text-zinc-100"
            >
              {ANALYSIS_PHASE_MESSAGES[phase]}
            </motion.h3>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden mb-8">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Phase checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {phaseOrder.map((p, index) => {
            const isCompleted = index < currentPhaseIndex;
            const isCurrent = index === currentPhaseIndex;
            const isPending = index > currentPhaseIndex;

            return (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-2 text-sm ${
                  isCompleted
                    ? "text-emerald-400"
                    : isCurrent
                    ? "text-cyan-400"
                    : "text-zinc-600"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-emerald-500/20"
                      : isCurrent
                      ? "bg-cyan-500/20"
                      : "bg-zinc-800"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : isCurrent ? (
                    <motion.div
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
                  )}
                </div>
                <span className="truncate">
                  {p === "fetching_website"
                    ? "Website"
                    : p === "fetching_social"
                    ? "Social"
                    : p === "analyzing_voice"
                    ? "Voice"
                    : p === "detecting_tone"
                    ? "Tone"
                    : p === "calculating_cohesion"
                    ? "Cohesion"
                    : p === "generating_verdict"
                    ? "Verdict"
                    : p === "validating"
                    ? "Validating"
                    : p}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Fun facts while loading */}
        <motion.div
          className="mt-8 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-zinc-500 text-center">
            💡 Did you know? Brands with consistent voice across platforms see 23% higher
            customer engagement.
          </p>
        </motion.div>
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 border-red-500/20"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">Analysis Failed</h3>
        <p className="text-sm text-zinc-400 mb-6 max-w-md">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-100 text-sm hover:bg-zinc-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  );
}
