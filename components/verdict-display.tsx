"use client";

import { motion } from "framer-motion";
import { Globe, AtSign, Lightbulb, TrendingUp, Quote } from "lucide-react";
import { type BrandAnalysisResult } from "@/lib/validation";
import { interpretCohesionScore } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface VerdictDisplayProps {
  result: BrandAnalysisResult;
}

export function VerdictDisplay({ result }: VerdictDisplayProps) {
  const cohesionInterpretation = interpretCohesionScore(result.cohesionScore);

  return (
    <div className="space-y-6">
      {/* Cohesion Score Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="glass" className="relative overflow-hidden">
          {/* Background gradient based on score */}
          <div
            className={`absolute inset-0 opacity-10 ${
              result.cohesionScore >= 75
                ? "bg-gradient-to-br from-emerald-500 to-cyan-500"
                : result.cohesionScore >= 50
                ? "bg-gradient-to-br from-amber-500 to-orange-500"
                : "bg-gradient-to-br from-red-500 to-pink-500"
            }`}
          />

          <CardContent className="relative pt-8 pb-8">
            <div className="text-center">
              {/* Score */}
              <div className="mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
                  className="inline-flex items-center justify-center"
                >
                  <div className="relative">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-zinc-800"
                      />
                      {/* Progress circle */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${result.cohesionScore * 2.83} 283`}
                        transform="rotate(-90 50 50)"
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{
                          strokeDasharray: `${result.cohesionScore * 2.83} 283`,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                      />
                      <defs>
                        <linearGradient
                          id="scoreGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-3xl font-bold text-zinc-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {result.cohesionScore}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className={`text-2xl font-bold ${cohesionInterpretation.color} mb-2`}>
                  {cohesionInterpretation.emoji} {cohesionInterpretation.label}
                </h2>
                <p className="text-zinc-400 max-w-md mx-auto">
                  {cohesionInterpretation.description}
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* The Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card variant="glass" className="verdict-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="h-5 w-5 text-cyan-400" />
              The Verdict
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-zinc-200 leading-relaxed italic">
              &ldquo;{result.verdict}&rdquo;
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Platform Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Website Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-400" />
                Website Voice
              </CardTitle>
              <CardDescription>{result.websiteAnalysis.dominantTone}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {result.websiteAnalysis.voiceSummary}
              </p>
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase mb-2">
                  Key Phrases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.websiteAnalysis.keyPhrases.map((phrase, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-cyan-500/10 text-cyan-300 rounded-md border border-cyan-500/20"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Social Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AtSign className="h-5 w-5 text-purple-400" />
                Social Voice
              </CardTitle>
              <CardDescription>{result.socialAnalysis.dominantTone}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {result.socialAnalysis.voiceSummary}
              </p>
              <div>
                <h4 className="text-xs font-medium text-zinc-500 uppercase mb-2">
                  Key Phrases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.socialAnalysis.keyPhrases.map((phrase, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-md border border-purple-500/20"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Brand Persona */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-pink-400" />
              Brand Persona
            </CardTitle>
            <CardDescription>
              Your brand&apos;s personality in a nutshell
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-200 leading-relaxed">{result.brandPersona}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              Recommendations
            </CardTitle>
            <CardDescription>
              Actionable steps to improve brand cohesion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-zinc-300">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
