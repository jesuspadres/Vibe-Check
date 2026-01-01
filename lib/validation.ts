import { z } from "zod";

// URL validation with proper sanitization
const urlSchema = z
  .string()
  .min(1, "Website URL is required")
  .transform((val) => {
    // Sanitize: trim whitespace and convert to lowercase for domain
    let sanitized = val.trim();
    
    // Add protocol if missing
    if (!sanitized.startsWith("http://") && !sanitized.startsWith("https://")) {
      sanitized = `https://${sanitized}`;
    }
    
    return sanitized;
  })
  .refine(
    (val) => {
      try {
        const url = new URL(val);
        // Ensure it's a valid http/https URL
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Please enter a valid website URL (e.g., https://example.com)" }
  )
  .refine(
    (val) => {
      try {
        const url = new URL(val);
        // Basic domain validation - must have at least one dot
        return url.hostname.includes(".");
      } catch {
        return false;
      }
    },
    { message: "URL must have a valid domain name" }
  );

// Social media handle validation
const socialHandleSchema = z
  .string()
  .min(1, "Social media handle is required")
  .transform((val) => {
    // Sanitize: remove @ symbol if present, trim whitespace
    let sanitized = val.trim();
    if (sanitized.startsWith("@")) {
      sanitized = sanitized.slice(1);
    }
    return sanitized;
  })
  .refine(
    (val) => {
      // Twitter/X handle: 1-15 characters, alphanumeric and underscores only
      // Instagram: 1-30 characters, alphanumeric, underscores, and periods
      const twitterPattern = /^[a-zA-Z0-9_]{1,15}$/;
      const instagramPattern = /^[a-zA-Z0-9_.]{1,30}$/;
      return twitterPattern.test(val) || instagramPattern.test(val);
    },
    {
      message:
        "Handle must be 1-30 characters and contain only letters, numbers, underscores, and periods",
    }
  )
  .refine(
    (val) => {
      // Prevent reserved words and potentially malicious inputs
      const reserved = ["admin", "support", "help", "twitter", "instagram", "null", "undefined"];
      return !reserved.includes(val.toLowerCase());
    },
    { message: "This handle is reserved and cannot be used" }
  );

// Social platform enum
const socialPlatformSchema = z.enum(["twitter", "instagram"], {
  errorMap: () => ({ message: "Please select Twitter/X or Instagram" }),
});

// Main audit request schema
export const brandAuditRequestSchema = z.object({
  websiteUrl: urlSchema,
  socialHandle: socialHandleSchema,
  socialPlatform: socialPlatformSchema,
});

// Infer types from schemas
export type BrandAuditRequest = z.infer<typeof brandAuditRequestSchema>;
export type SocialPlatform = z.infer<typeof socialPlatformSchema>;

// API Response schemas for type safety
export const brandAxisScoreSchema = z.object({
  professionalCasual: z.number().min(0).max(100), // 0 = Professional, 100 = Casual
  seriousWitty: z.number().min(0).max(100), // 0 = Serious, 100 = Witty
  modernTraditional: z.number().min(0).max(100), // 0 = Modern, 100 = Traditional
  directEmotive: z.number().min(0).max(100), // 0 = Direct, 100 = Emotive
});

export type BrandAxisScore = z.infer<typeof brandAxisScoreSchema>;

export const brandAnalysisResultSchema = z.object({
  websiteAnalysis: z.object({
    scores: brandAxisScoreSchema,
    voiceSummary: z.string(),
    keyPhrases: z.array(z.string()),
    dominantTone: z.string(),
  }),
  socialAnalysis: z.object({
    scores: brandAxisScoreSchema,
    voiceSummary: z.string(),
    keyPhrases: z.array(z.string()),
    dominantTone: z.string(),
  }),
  cohesionScore: z.number().min(0).max(100),
  verdict: z.string(),
  recommendations: z.array(z.string()),
  brandPersona: z.string(),
});

export type BrandAnalysisResult = z.infer<typeof brandAnalysisResultSchema>;

// Rate limit response schema
export const rateLimitErrorSchema = z.object({
  error: z.literal("rate_limit_exceeded"),
  message: z.string(),
  resetTime: z.string(),
  remainingAttempts: z.number(),
});

export type RateLimitError = z.infer<typeof rateLimitErrorSchema>;

// Generic API error schema
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

// Validation helper function
export function validateBrandAuditRequest(data: unknown): {
  success: true;
  data: BrandAuditRequest;
} | {
  success: false;
  errors: z.ZodError;
} {
  const result = brandAuditRequestSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

// Sanitization utility for additional security
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML/script injection
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/data:/gi, "") // Remove data: protocol
    .trim()
    .slice(0, 500); // Limit length to prevent DoS
}
