# ⚡ Vibe Check - Brand Auditor

A sophisticated Next.js 14 application that audits a brand's linguistic consistency across different platforms using AI analysis.

![Brand Auditor](https://via.placeholder.com/1200x630/18181b/06b6d4?text=Vibe+Check+Brand+Auditor)

## ✨ Features

- **Dual Platform Analysis**: Compare brand voice between website and social media
- **AI-Powered Insights**: Claude AI analyzes voice, tone, and persona
- **Brand Compass Visualization**: Radar chart comparing 4 key axes
- **Cohesion Scoring**: Quantified brand consistency measurement
- **Rate Limiting**: Built-in Upstash/Redis protection against abuse
- **Beautiful Dark UI**: Sophisticated zinc-950 aesthetic with animations

## 🎯 The Four Axes

1. **Professional ↔ Casual**: Formality level of communication
2. **Serious ↔ Witty**: Use of humor and playfulness
3. **Modern ↔ Traditional**: Contemporary vs. classic positioning
4. **Direct ↔ Emotive**: Factual vs. emotional appeal

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom Shadcn-inspired components
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Validation**: Zod
- **AI**: Anthropic Claude API
- **Rate Limiting**: Upstash Redis

## 📁 Project Structure

```
vibe-check-brand-auditor/
├── app/
│   ├── api/
│   │   └── audit/
│   │       └── route.ts       # AI analysis API endpoint
│   ├── globals.css            # Global styles & Tailwind
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main application page
├── components/
│   ├── ui/
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx           # Card component
│   │   ├── input.tsx          # Input component
│   │   └── select.tsx         # Select component
│   ├── audit-form.tsx         # Input form component
│   ├── brand-compass.tsx      # Radar chart visualization
│   ├── scanning-animation.tsx # Loading states
│   └── verdict-display.tsx    # Results display
├── lib/
│   ├── rate-limit.ts          # Upstash rate limiting
│   ├── types.ts               # TypeScript types
│   ├── utils.ts               # Utility functions
│   └── validation.ts          # Zod schemas
├── .env.example               # Environment variables template
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key
- Upstash Redis account (for rate limiting)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibe-check-brand-auditor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your credentials:
   ```
   ANTHROPIC_API_KEY=your_key_here
   UPSTASH_REDIS_REST_URL=your_url_here
   UPSTASH_REDIS_REST_TOKEN=your_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## 🔐 Security Features

### Input Validation (Zod)
- URL format validation with protocol normalization
- Social handle sanitization (removes @, validates format)
- Input length limits to prevent DoS
- Reserved word blocking

### Rate Limiting
- 3 audits per IP per hour
- Sliding window algorithm via Upstash
- Graceful fallback to in-memory limiting
- Clear error messages with reset times

### Sanitization
- HTML/script tag removal
- Protocol injection prevention
- Input truncation

## 📊 API Response Schema

```typescript
interface BrandAnalysisResult {
  websiteAnalysis: {
    scores: BrandAxisScore;
    voiceSummary: string;
    keyPhrases: string[];
    dominantTone: string;
  };
  socialAnalysis: {
    scores: BrandAxisScore;
    voiceSummary: string;
    keyPhrases: string[];
    dominantTone: string;
  };
  cohesionScore: number;     // 0-100
  verdict: string;           // Punchy summary
  recommendations: string[]; // Actionable advice
  brandPersona: string;      // Personality profile
}

interface BrandAxisScore {
  professionalCasual: number;  // 0-100
  seriousWitty: number;        // 0-100
  modernTraditional: number;   // 0-100
  directEmotive: number;       // 0-100
}
```

## 🎨 Customization

### Theming
Edit `tailwind.config.ts` to customize:
- Color palette
- Typography
- Animations
- Shadows

### AI Personality
Modify the `BRAND_AUDITOR_SYSTEM_PROMPT` in `app/api/audit/route.ts` to adjust:
- Analysis criteria
- Response tone
- Scoring methodology

## 🔧 Production Considerations

1. **Web Scraping**: Integrate a proper scraping service (Firecrawl, Browserless, ScrapingBee) for reliable website content extraction

2. **Social Media APIs**: Connect to official APIs:
   - Twitter/X API for tweets
   - Instagram Graph API for posts

3. **Caching**: Add Redis caching for repeated brand audits

4. **Analytics**: Track usage patterns and popular brands

5. **Error Monitoring**: Integrate Sentry or similar for error tracking

## 📄 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss proposed changes.

---

Built with ❤️ using Next.js and Claude AI
