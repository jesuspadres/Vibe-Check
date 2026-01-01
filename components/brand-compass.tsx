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
import { type BrandAxisScore } from "@/lib/validation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface BrandCompassProps {
  websiteScores: BrandAxisScore;
  socialScores: BrandAxisScore;
}

interface RadarDataPoint {
  axis: string;
  axisShort: string;
  website: number;
  social: number;
  fullMark: number;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const axisName = payload[0]?.payload?.axis;
  const [leftLabel, rightLabel] = axisName ? axisName.split(" ↔ ") : ["", ""];

  return (
    <div className="bg-white border border-stone-200 rounded-sm p-4 shadow-lg max-w-xs">
      <p className="text-sm font-medium text-zinc-900 mb-1">
        {axisName}
      </p>
      <p className="text-[10px] text-stone-500 mb-3">
        0 = {leftLabel} · 100 = {rightLabel}
      </p>
      {payload.map((entry: any, index: number) => {
        const value = entry.value;
        const interpretation = value <= 30 
          ? `Mostly ${leftLabel.toLowerCase()}` 
          : value >= 70 
            ? `Mostly ${rightLabel.toLowerCase()}`
            : "Balanced";
        
        return (
          <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-stone-600">{entry.name}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-900 font-medium">{value}</span>
              <span className="text-stone-400 ml-1">({interpretation})</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BrandCompass({ websiteScores, socialScores }: BrandCompassProps) {
  const data: RadarDataPoint[] = [
    {
      axis: "Professional ↔ Casual",
      axisShort: "Pro → Casual",
      website: websiteScores.professionalCasual,
      social: socialScores.professionalCasual,
      fullMark: 100,
    },
    {
      axis: "Serious ↔ Witty",
      axisShort: "Serious → Witty",
      website: websiteScores.seriousWitty,
      social: socialScores.seriousWitty,
      fullMark: 100,
    },
    {
      axis: "Modern ↔ Traditional",
      axisShort: "Modern → Trad",
      website: websiteScores.modernTraditional,
      social: socialScores.modernTraditional,
      fullMark: 100,
    },
    {
      axis: "Direct ↔ Emotive",
      axisShort: "Direct → Emotive",
      website: websiteScores.directEmotive,
      social: socialScores.directEmotive,
      fullMark: 100,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <span className="label-tag mb-4">Voice Mapping</span>
          <CardTitle className="text-2xl">Brand Compass</CardTitle>
          <CardDescription>
            Compare how your brand voice differs between platforms. When the green (website) and amber (social) markers are close together, your voice is consistent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chart container - architectural style */}
          <div className="relative chart-architectural">
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <defs>
                  <linearGradient id="websiteGradientEditorial" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#166534" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#166534" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="socialGradientEditorial" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b45309" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#b45309" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <PolarGrid
                  stroke="#d4d4d4"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                <PolarAngleAxis
                  dataKey="axisShort"
                  tick={{ 
                    fill: "#57534e", 
                    fontSize: 10,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500
                  }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#a1a1aa", fontSize: 9 }}
                  tickCount={5}
                  axisLine={false}
                />
                <Radar
                  name="Website"
                  dataKey="website"
                  stroke="#166534"
                  fill="url(#websiteGradientEditorial)"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    fill: "#166534",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#166534",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
                <Radar
                  name="Social"
                  dataKey="social"
                  stroke="#b45309"
                  fill="url(#socialGradientEditorial)"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    fill: "#b45309",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#b45309",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "24px",
                  }}
                  formatter={(value) => (
                    <span className="text-xs text-stone-600 ml-1">{value}</span>
                  )}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Axis details - visual spectrum display */}
          <div className="divider my-8" />
          
          <div className="space-y-6">
            {data.map((item) => {
              const diff = Math.abs(item.website - item.social);
              const alignment = diff <= 15 ? "Aligned" : diff <= 35 ? "Moderate Gap" : "Misaligned";
              const alignmentColor =
                diff <= 15
                  ? "text-green-800"
                  : diff <= 35
                  ? "text-amber-600"
                  : "text-red-600";
              
              // Get the left and right labels from the axis name
              const [leftLabel, rightLabel] = item.axis.split(" ↔ ");

              return (
                <div
                  key={item.axis}
                  className="p-5 border border-stone-200 rounded-sm bg-white"
                >
                  {/* Axis title and alignment status */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-zinc-900">{item.axis}</p>
                    <span className={`text-[10px] uppercase tracking-wider font-medium ${alignmentColor}`}>
                      {alignment}
                    </span>
                  </div>
                  
                  {/* Visual spectrum bar */}
                  <div className="relative">
                    {/* Labels */}
                    <div className="flex justify-between text-[10px] text-stone-500 mb-2">
                      <span>{leftLabel}</span>
                      <span>{rightLabel}</span>
                    </div>
                    
                    {/* Spectrum track */}
                    <div className="relative h-2 bg-stone-100 rounded-full">
                      {/* Website marker */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-800 border-2 border-white shadow-sm z-10"
                        style={{ left: `calc(${item.website}% - 6px)` }}
                        title={`Website: ${item.website}`}
                      />
                      {/* Social marker */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-600 border-2 border-white shadow-sm z-10"
                        style={{ left: `calc(${item.social}% - 6px)` }}
                        title={`Social: ${item.social}`}
                      />
                    </div>
                    
                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-3 text-[10px] text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-800" />
                        <span>Website: {item.website}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-600" />
                        <span>Social: {item.social}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Explanation */}
          <p className="text-[11px] text-stone-400 mt-6 text-center">
            Each axis runs from 0 (left trait) to 100 (right trait). Closer markers = more consistent voice.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}