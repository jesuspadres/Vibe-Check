"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, AtSign, ArrowRight, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
    <section className="relative py-24 md:py-32 px-8 lg:px-12">
      <div className="relative max-w-xl mx-auto">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="label-tag-accent mb-6 inline-block"
          >
            Brand Analysis
          </motion.span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-zinc-900 tracking-tight leading-[1.1] mb-8">
            Is your brand
            <br />
            <span className="text-forest italic">speaking clearly?</span>
          </h1>

          <p className="text-lg text-stone-500 max-w-md mx-auto leading-relaxed">
            We analyze the consistency of your brand voice across your website and social presence.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div 
          className="divider-short mx-auto mb-16"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Website URL Input */}
            <Input
              label="Website URL"
              placeholder="Website URL"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              error={errors.websiteUrl}
              leftIcon={<Globe className="h-5 w-5" />}
              disabled={isLoading}
            />

            {/* Social Media Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Select
                label="Platform"
                options={platformOptions}
                value={socialPlatform}
                onChange={(val) => setSocialPlatform(val as "twitter" | "instagram")}
                error={errors.socialPlatform}
              />

              <Input
                label="Social Handle"
                placeholder="Social Handle"
                value={socialHandle}
                onChange={(e) => setSocialHandle(e.target.value)}
                error={errors.socialHandle}
                leftIcon={<AtSign className="h-5 w-5" />}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-8 text-center">
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                rightIcon={!isLoading && <ArrowRight className="h-4 w-4" />}
              >
                {isLoading ? "Analyzing..." : "Begin Analysis"}
              </Button>
            </div>
          </form>

          {/* Rate limit notice */}
          <motion.p 
            className="text-xs text-stone-400 text-center mt-12 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Three complimentary audits per hour
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}