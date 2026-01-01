"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuditForm } from "@/components/audit-form";
import { ScanningAnimation, ErrorDisplay } from "@/components/scanning-animation";
import { BrandCompass } from "@/components/brand-compass";
import { VerdictDisplay } from "@/components/verdict-display";
import { type BrandAuditRequest, type BrandAnalysisResult } from "@/lib/validation";
import { type AnalysisPhase } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  const [analysisPhase, setAnalysisPhase] = useState<AnalysisPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BrandAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateProgress = useCallback(() => {
    const phases: { phase: AnalysisPhase; progress: number; delay: number }[] = [
      { phase: "validating", progress: 10, delay: 0 },
      { phase: "fetching_website", progress: 25, delay: 800 },
      { phase: "fetching_social", progress: 40, delay: 1500 },
      { phase: "analyzing_voice", progress: 55, delay: 2200 },
      { phase: "detecting_tone", progress: 70, delay: 3000 },
      { phase: "calculating_cohesion", progress: 85, delay: 3800 },
      { phase: "generating_verdict", progress: 95, delay: 4500 },
    ];

    phases.forEach(({ phase, progress, delay }) => {
      setTimeout(() => {
        setAnalysisPhase(phase);
        setProgress(progress);
      }, delay);
    });
  }, []);

  const handleSubmit = async (data: BrandAuditRequest) => {
    setError(null);
    setResult(null);
    setAnalysisPhase("validating");
    setProgress(5);

    simulateProgress();

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(responseData.message || "Rate limit exceeded. Please try again later.");
        }
        throw new Error(responseData.message || "Failed to analyze brand");
      }

      setTimeout(() => {
        setProgress(100);
        setAnalysisPhase("complete");
        setResult(responseData.data);
      }, 5500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setAnalysisPhase("error");
    }
  };

  const handleReset = () => {
    setAnalysisPhase("idle");
    setProgress(0);
    setResult(null);
    setError(null);
  };

  const isLoading = analysisPhase !== "idle" && analysisPhase !== "complete" && analysisPhase !== "error";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {(analysisPhase === "complete" || analysisPhase === "error") && (
                <button
                  onClick={handleReset}
                  className="p-2 -ml-2 text-stone-400 hover:text-zinc-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <span className="text-lg font-serif font-bold text-zinc-900 tracking-tight">
                Vibe Check
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <span className="label-tag">
                Brand Auditor
              </span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16">
        <AnimatePresence mode="wait">
          {/* Form View */}
          {analysisPhase === "idle" && !result && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AuditForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>
          )}

          {/* Loading View */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="py-32 px-8 lg:px-12 max-w-2xl mx-auto"
            >
              <ScanningAnimation phase={analysisPhase} progress={progress} />
            </motion.div>
          )}

          {/* Error View */}
          {analysisPhase === "error" && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="py-32 px-8 lg:px-12 max-w-2xl mx-auto"
            >
              <ErrorDisplay message={error} onRetry={handleReset} />
            </motion.div>
          )}

          {/* Results View */}
          {analysisPhase === "complete" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="py-16 px-8 lg:px-12"
            >
              <div className="max-w-6xl mx-auto">
                {/* Results Header */}
                <motion.div 
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <span className="label-tag-accent mb-4 inline-block">
                    Analysis Complete
                  </span>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 tracking-tight mt-4">
                    Brand Voice Report
                  </h1>
                </motion.div>

                {/* Bento Grid Results */}
                <div className="bento-grid">
                  {/* Cohesion Score - Featured */}
                  <motion.div 
                    className="bento-item-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <VerdictDisplay result={result} />
                  </motion.div>

                  {/* Radar Chart */}
                  <motion.div 
                    className="bento-item-half"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <BrandCompass
                      websiteScores={result.websiteAnalysis.scores}
                      socialScores={result.socialAnalysis.scores}
                    />
                  </motion.div>

                  {/* Brand Persona */}
                  <motion.div 
                    className="bento-item-half"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div className="bg-white border border-stone-200 rounded-sm p-10 shadow-editorial">
                      <span className="label-tag mb-6 inline-block">Brand Persona</span>
                      <p className="text-xl font-serif text-zinc-700 leading-relaxed italic">
                        &ldquo;{result.brandPersona}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* New Audit Button */}
                <motion.div 
                  className="text-center mt-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <button
                    onClick={handleReset}
                    className="btn-pill-ghost"
                  >
                    Analyze Another Brand
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-32">
        <div className="max-w-6xl mx-auto px-8 lg:px-12 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-stone-500">
            <p>
              A thoughtful approach to brand analysis
            </p>
            <p className="text-xs tracking-wide-plus uppercase text-stone-400">
              © {new Date().getFullYear()} Vibe Check Studio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}