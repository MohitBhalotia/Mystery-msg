"use client";

import { motion } from "framer-motion";
import { Lock, Shield, Mail,  User, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Information We Collect",
      content: (
        <>
          <p className="mb-4">We collect information to provide better services to all our users. The types of information we collect include:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Account information (username, email, profile information)</li>
            <li>Messages and content you create or receive</li>
            <li>Usage data and interaction with our services</li>
            <li>Device and connection information</li>
          </ul>
        </>
      ),
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "How We Use Your Information",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, maintain, and improve our services</li>
          <li>Develop new features and functionality</li>
          <li>Communicate with you about our services</li>
          <li>Protect MysteryMsg and our users</li>
          <li>Measure performance and analyze usage</li>
        </ul>
      ),
    },
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Data Security",
      content: (
        <>
          <p className="mb-4">We implement appropriate technical and organizational measures to protect your personal data, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication</li>
            <li>Regular security training for our staff</li>
          </ul>
        </>
      ),
    },
    {
      icon: <User className="h-6 w-6 text-primary" />,
      title: "Your Rights",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Access and receive a copy of your personal data</li>
          <li>Rectify any personal data that is inaccurate</li>
          <li>Request deletion of your personal data</li>
          <li>Restrict or object to processing of your data</li>
          <li>Data portability</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border/50">
          <div className="px-8 py-12 sm:px-12">
            <div className="prose prose-lg prose-primary max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                At MysteryMsg, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
              </p>

              <div className="space-y-16">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="border-l-2 border-primary/20 pl-6 relative"
                  >
                    <div className="absolute -left-[10px] top-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">{section.title}</h2>
                    <div className="text-muted-foreground">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-border/50">
                <h3 className="text-xl font-semibold text-foreground mb-4">Contact Us</h3>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="flex items-center space-x-3 text-primary">
                  <Mail className="h-5 w-5" />
                  <Link href="mailto:privacy@mysterymsg.com" className="hover:underline">
                    privacy@mysterymsg.com
                  </Link>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-12 italic">
                This policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} and may be updated from time to time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
