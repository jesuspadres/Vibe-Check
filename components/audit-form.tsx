"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, AtSign, Scan, Sparkles, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { validateBrandAuditRequest, type BrandAuditRequest } from "@/lib/validation";

interface AuditFormProps {
  onSubmit: (data: BrandAuditRequest) => Promise<void>;
  isLoading: boolean;
}

const platformOptions = [
  {
    value: "twitter",
    label: "X (Twitter)",
    icon: <Twitter className="h-4 w-4" />,
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
  },
];

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [socialPlatform, setSocialPlatform] = useState<"twitter" | "instagram">("twitter");
  const [errors, setErrors] = useState<{
    websiteUrl?: string;
    socialHandle?: string;
    socialPlatform?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateBrandAuditRequest({
      websiteUrl,
      socialHandle,
      socialPlatform,
    });

    if (!validation.success) {
      const newErrors: typeof errors = {};
      validation.errors.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        if (field) {
          newErrors[field] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    await onSubmit(validation.data);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 mb-6">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-zinc-300">AI-Powered Brand Analysis</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-zinc-100">The </span>
            <span className="gradient-text">Vibe Check</span>
            <br />
            <span className="text-zinc-100">Brand Auditor</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Is your brand speaking with one voice or having an identity crisis?
            <br />
            We&apos;ll analyze your website and social presence to find out.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="glass" className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Website URL Input */}
              <Input
                label="Website URL"
                placeholder="https://yourbrand.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                error={errors.websiteUrl}
                leftIcon={<Globe className="h-4 w-4" />}
                disabled={isLoading}
              />

              {/* Social Media Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Social Platform"
                  options={platformOptions}
                  value={socialPlatform}
                  onChange={(val) => setSocialPlatform(val as "twitter" | "instagram")}
                  error={errors.socialPlatform}
                />

                <Input
                  label="Social Handle"
                  placeholder="@yourbrand"
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  error={errors.socialHandle}
                  leftIcon={<AtSign className="h-4 w-4" />}
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                leftIcon={!isLoading && <Scan className="h-5 w-5" />}
              >
                {isLoading ? "Analyzing Brand DNA..." : "Run the Vibe Check"}
              </Button>
            </form>

            {/* Info text */}
            <p className="text-xs text-zinc-500 text-center mt-4">
              Limited to 3 audits per hour • Results are AI-generated insights
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
