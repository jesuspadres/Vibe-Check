"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuditForm } from "@/components/audit-form";
import { ScanningAnimation, ErrorDisplay } from "@/components/scanning-animation";
import { BrandCompass } from "@/components/brand-compass";
import { VerdictDisplay } from "@/components/verdict-display";
import { type BrandAuditRequest, type BrandAnalysisResult } from "@/lib/validation";
import { type AnalysisPhase } from "@/lib/types";
import { RefreshCw, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    // Start progress simulation
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

      // Wait a bit to show the final progress state
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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold gradient-text">⚡ Vibe Check</span>
            </div>
            <nav className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
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
            >
              <AuditForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>
          )}

          {/* Loading View */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto"
            >
              <ScanningAnimation phase={analysisPhase} progress={progress} />
            </motion.div>
          )}

          {/* Error View */}
          {analysisPhase === "error" && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto"
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
              className="py-12 px-4 sm:px-6 lg:px-8"
            >
              <div className="max-w-6xl mx-auto">
                {/* Reset button */}
                <div className="flex justify-end mb-6">
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                  >
                    Audit Another Brand
                  </Button>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Radar Chart */}
                  <div className="lg:sticky lg:top-24 lg:self-start">
                    <BrandCompass
                      websiteScores={result.websiteAnalysis.scores}
                      socialScores={result.socialAnalysis.scores}
                    />
                  </div>

                  {/* Right Column - Verdict & Details */}
                  <div>
                    <VerdictDisplay result={result} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>
              Built with{" "}
              <span className="text-zinc-400">Next.js</span>,{" "}
              <span className="text-zinc-400">Claude AI</span>, and a passion for brand consistency
            </p>
            <p>
              © {new Date().getFullYear()} Vibe Check Brand Auditor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
