"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { type BrandAxisScore, type BrandAnalysisResult } from "@/lib/validation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface BrandCompassProps {
  websiteScores: BrandAxisScore;
  socialScores: BrandAxisScore;
}

interface RadarDataPoint {
  axis: string;
  website: number;
  social: number;
  fullMark: number;
}

// Custom tooltip component
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-zinc-100 mb-2">{payload[0]?.payload?.axis}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-zinc-400">{entry.name}:</span>
          <span className="text-zinc-100 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function BrandCompass({ websiteScores, socialScores }: BrandCompassProps) {
  // Transform scores into radar chart data
  const data: RadarDataPoint[] = [
    {
      axis: "Professional ↔ Casual",
      website: websiteScores.professionalCasual,
      social: socialScores.professionalCasual,
      fullMark: 100,
    },
    {
      axis: "Serious ↔ Witty",
      website: websiteScores.seriousWitty,
      social: socialScores.seriousWitty,
      fullMark: 100,
    },
    {
      axis: "Modern ↔ Traditional",
      website: websiteScores.modernTraditional,
      social: socialScores.modernTraditional,
      fullMark: 100,
    },
    {
      axis: "Direct ↔ Emotive",
      website: websiteScores.directEmotive,
      social: socialScores.directEmotive,
      fullMark: 100,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            Brand Compass
          </CardTitle>
          <CardDescription>
            Visual comparison of voice attributes across platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="radar-container">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                <PolarGrid
                  stroke="#3f3f46"
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#71717a", fontSize: 10 }}
                  tickCount={5}
                  axisLine={false}
                />
                <Radar
                  name="Website"
                  dataKey="website"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: "#06b6d4",
                    stroke: "#06b6d4",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#06b6d4",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
                <Radar
                  name="Social"
                  dataKey="social"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: "#a855f7",
                    stroke: "#a855f7",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#a855f7",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                  }}
                  formatter={(value) => (
                    <span className="text-sm text-zinc-300">{value}</span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Axis legend */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-800">
            {data.map((item, index) => {
              const diff = Math.abs(item.website - item.social);
              const alignment =
                diff <= 15 ? "High" : diff <= 35 ? "Medium" : "Low";
              const alignmentColor =
                diff <= 15
                  ? "text-emerald-400"
                  : diff <= 35
                  ? "text-amber-400"
                  : "text-red-400";

              return (
                <div
                  key={item.axis}
                  className="text-sm p-3 rounded-lg bg-zinc-800/30"
                >
                  <p className="font-medium text-zinc-300 mb-1">{item.axis}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-cyan-400">Web: {item.website}</span>
                    <span className="text-purple-400">Social: {item.social}</span>
                    <span className={alignmentColor}>({alignment} alignment)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
