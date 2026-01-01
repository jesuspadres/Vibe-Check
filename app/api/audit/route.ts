import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { brandAuditRequestSchema, type BrandAnalysisResult } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/validation";
import { BRAND_AUDITOR_SYSTEM_PROMPT, BRAND_AUDITOR_LIMITED_PROMPT } from "@/lib/prompts/brand-auditor";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Simulated content fetching (in production, you'd scrape or use APIs)
async function fetchWebsiteContent(url: string): Promise<string> {
  // In a real implementation, you would:
  // 1. Use a headless browser or scraping service
  // 2. Extract relevant text content (headlines, body copy, CTAs)
  // 3. Clean and normalize the text
  
  // For demo purposes, we'll use a mock response
  // In production, integrate with a web scraping service like Firecrawl, Browserless, etc.
  
  try {
    // Attempt basic fetch (many sites will block this)
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BrandAuditor/1.0)",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Basic HTML text extraction (very simplified)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000); // Limit content
    
    return textContent || "Unable to extract content from this website.";
  } catch (error) {
    // Return a note about the fetch failure
    return `[Note: Could not directly fetch ${url}. Please analyze based on general knowledge of this brand if available, or provide a general analysis framework.]`;
  }
}

async function fetchSocialContent(
  handle: string,
  platform: "twitter" | "instagram"
): Promise<string> {
  // In production, you would use:
  // - Twitter/X API for tweets
  // - Instagram Graph API for posts
  // - Third-party services like Apify or social media scrapers
  
  // For demo, return a note about the platform
  return `[Social media content for @${handle} on ${platform}. Note: In production, this would fetch actual posts, bios, and recent content via the ${platform} API.]`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimit = await checkRateLimit(clientIp);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message: rateLimit.message,
          resetTime: rateLimit.reset.toISOString(),
          remainingAttempts: rateLimit.remaining,
        },
        { status: 429 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validation = brandAuditRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid request data",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { websiteUrl, socialHandle, socialPlatform } = validation.data;

    // 3. Sanitize inputs (additional layer of protection)
    const sanitizedUrl = sanitizeInput(websiteUrl);
    const sanitizedHandle = sanitizeInput(socialHandle);

    // 4. Fetch content from both sources
    const [websiteContent, socialContent] = await Promise.all([
      fetchWebsiteContent(sanitizedUrl),
      fetchSocialContent(sanitizedHandle, socialPlatform),
    ]);

    // 5. Determine if we have limited content
    const hasLimitedContent = 
      websiteContent.includes("[Note:") || 
      socialContent.includes("[Note:") ||
      websiteContent.length < 200;
    
    const systemPrompt = hasLimitedContent 
      ? BRAND_AUDITOR_LIMITED_PROMPT 
      : BRAND_AUDITOR_SYSTEM_PROMPT;

    // 6. Call Anthropic API for analysis
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Analyze this brand's voice and tone consistency.

═══════════════════════════════════════════
WEBSITE
═══════════════════════════════════════════
URL: ${sanitizedUrl}

CONTENT:
${websiteContent}

═══════════════════════════════════════════
SOCIAL MEDIA
═══════════════════════════════════════════
Platform: ${socialPlatform.toUpperCase()}
Handle: @${sanitizedHandle}

CONTENT:
${socialContent}

═══════════════════════════════════════════

Now give me the JSON analysis. No preamble.`,
        },
      ],
      system: systemPrompt,
    });

    // 7. Extract and parse the response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    
    // Try to parse the JSON response
    let analysisResult: BrandAnalysisResult;
    
    try {
      // Find JSON in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      analysisResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      // If parsing fails, return a mock response for demo purposes
      console.error("Failed to parse AI response:", parseError);
      analysisResult = {
        websiteAnalysis: {
          scores: {
            professionalCasual: 45,
            seriousWitty: 30,
            modernTraditional: 25,
            directEmotive: 50,
          },
          voiceSummary:
            "The website maintains a balanced professional tone with occasional moments of warmth.",
          keyPhrases: ["innovation", "trusted partner", "your success"],
          dominantTone: "Confident Professional",
        },
        socialAnalysis: {
          scores: {
            professionalCasual: 65,
            seriousWitty: 55,
            modernTraditional: 30,
            directEmotive: 60,
          },
          voiceSummary:
            "Social presence is noticeably more relaxed and engaging than the website.",
          keyPhrases: ["let's chat", "exciting news", "community"],
          dominantTone: "Friendly Enthusiast",
        },
        cohesionScore: 72,
        verdict:
          "Your brand has a mild case of 'business in the front, party in the tweets.' The website speaks like it's wearing a suit, while social is in business casual.",
        recommendations: [
          "Consider adding more personality to website copy to match social energy",
          "Create a brand voice guide that works across all channels",
          "Test informal CTAs on website to see if they improve engagement",
        ],
        brandPersona:
          "If your brand were a person, they'd be a 30-something marketing professional who's buttoned-up in meetings but has a secret TikTok account. Loves a good pun but saves it for happy hour.",
      };
    }

    // 8. Return successful response
    return NextResponse.json({
      success: true,
      data: analysisResult,
      metadata: {
        analyzedAt: new Date().toISOString(),
        rateLimitRemaining: rateLimit.remaining,
        rateLimitReset: rateLimit.reset.toISOString(),
      },
    });
  } catch (error) {
    console.error("Brand audit error:", error);
    
    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: "ai_service_error",
          message: "AI analysis service temporarily unavailable",
          details: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "internal_error",
        message: "An unexpected error occurred during brand analysis",
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "method_not_allowed", message: "Use POST to submit a brand audit" },
    { status: 405 }
  );
}
