"use client";

import { motion } from "framer-motion";
import { Globe, AtSign, Lightbulb } from "lucide-react";
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
      {/* Main Score + Verdict Card */}
      <Card>
        <CardContent className="p-10 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Score Section */}
            <div className="md:border-r md:border-stone-100 md:pr-10">
              <span className="label-tag-accent mb-6 inline-block">Cohesion Score</span>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.3, delay: 0.2 }}
                className="relative"
              >
                {/* Score ring */}
                <div className="relative w-32 h-32 mx-auto md:mx-0">
                  <svg className="w-full h-full score-ring" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#f5f5f4"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#166534"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${result.cohesionScore * 2.64} 264`}
                      transform="rotate(-90 50 50)"
                      initial={{ strokeDasharray: "0 264" }}
                      animate={{
                        strokeDasharray: `${result.cohesionScore * 2.64} 264`,
                      }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-4xl font-serif font-bold text-zinc-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {result.cohesionScore}
                    </motion.span>
                  </div>
                </div>

                <motion.div 
                  className="mt-6 text-center md:text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className={`text-lg font-serif font-semibold ${
                    result.cohesionScore >= 75 
                      ? "text-green-800" 
                      : result.cohesionScore >= 50 
                        ? "text-amber-700" 
                        : "text-red-700"
                  }`}>
                    {cohesionInterpretation.label}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    {cohesionInterpretation.description}
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Verdict Section */}
            <div className="md:col-span-2">
              <span className="label-tag mb-6 inline-block">The Verdict</span>
              
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="quote-editorial"
              >
                {result.verdict}
              </motion.blockquote>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Analysis - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Website Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-green-800" />
                </div>
                <div>
                  <CardTitle className="text-lg">Website</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider">
                    {result.websiteAnalysis.dominantTone}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-stone-600 leading-relaxed">
                {result.websiteAnalysis.voiceSummary}
              </p>
              
              <div className="divider" />
              
              <div>
                <h4 className="text-[10px] font-medium text-stone-400 uppercase tracking-widest mb-3">
                  Key Phrases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.websiteAnalysis.keyPhrases.map((phrase, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-xs bg-green-50 text-green-800 rounded-full border border-green-200"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AtSign className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <CardTitle className="text-lg">Social</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider">
                    {result.socialAnalysis.dominantTone}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-stone-600 leading-relaxed">
                {result.socialAnalysis.voiceSummary}
              </p>
              
              <div className="divider" />
              
              <div>
                <h4 className="text-[10px] font-medium text-stone-400 uppercase tracking-widest mb-3">
                  Key Phrases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.socialAnalysis.keyPhrases.map((phrase, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-xs bg-amber-50 text-amber-700 rounded-full border border-amber-200"
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

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-stone-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Recommendations</CardTitle>
                <CardDescription>
                  Actionable steps to improve brand cohesion
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {result.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-stone-600 leading-relaxed pt-1">
                    {rec}
                  </span>
                </motion.li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}