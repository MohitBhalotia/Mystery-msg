"use client";

import { motion } from "framer-motion";
import { FileText, Gavel, Shield, AlertTriangle, User, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  const sections = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "1. Introduction",
      content: (
        <p className="mb-4">
          Welcome to MysteryMsg! These Terms of Service (&quot;Terms&quot;) govern your access to and use of the MysteryMsg website, 
          applications, and services (collectively, the &quot;Service&quot;). By accessing or using our Service, you agree to be bound 
          by these Terms and our Privacy Policy.
        </p>
      ),
    },
    {
      icon: <User className="h-6 w-6 text-primary" />,
      title: "2. Accounts",
      content: (
        <>
          <p className="mb-4">When you create an account with us, you must provide accurate and complete information.</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>You must be at least 13 years old to use our Service</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You must not share your account credentials with others</li>
          </ul>
        </>
      ),
    },
    {
      icon: <Gavel className="h-6 w-6 text-primary" />,
      title: "3. User Responsibilities",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>You agree not to use the Service for any illegal or unauthorized purpose</li>
          <li>You must not transmit any worms, viruses, or any code of a destructive nature</li>
          <li>You must not violate any laws in your jurisdiction</li>
          <li>You must not submit false or misleading information</li>
          <li>You must not interfere with or disrupt the Service</li>
        </ul>
      ),
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "4. Content Ownership",
      content: (
        <>
          <p className="mb-4">
            You retain ownership of any intellectual property rights that you hold in the content you submit or post on or through the Service.
          </p>
          <p className="mb-4">
            By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, 
            and display such content for the purpose of providing and improving our services.
          </p>
        </>
      ),
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-primary" />,
      title: "5. Disclaimers",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>The Service is provided &quot;as is&quot; without any warranties, express or implied</li>
          <li>We do not guarantee that the Service will be available 100% of the time</li>
          <li>We are not responsible for any content posted by users</li>
          <li>We reserve the right to modify or discontinue the Service at any time</li>
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
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border/50">
          <div className="px-8 py-12 sm:px-12">
            <div className="prose prose-lg prose-primary max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Please read these Terms of Service (&quot;Terms&quot;) carefully before using the MysteryMsg website and services.
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="border-l-2 border-primary/20 pl-6 relative"
                >
                  <div className="absolute -left-[10px] top-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to Terms</h2>
                  <div className="text-muted-foreground">
                    <p className="mb-4">
                      We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide 
                      at least 30 days&apos; notice prior to any new terms taking effect.
                    </p>
                    <p>
                      By continuing to access or use our Service after those revisions become effective, you agree to be bound by the 
                      revised terms. If you do not agree to the new terms, please stop using the Service.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-16 pt-8 border-t border-border/50">
                <h3 className="text-xl font-semibold text-foreground mb-4">Contact Us</h3>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="flex items-center space-x-3 text-primary">
                  <Mail className="h-5 w-5" />
                  <Link href="mailto:legal@mysterymsg.com" className="hover:underline">
                    legal@mysterymsg.com
                  </Link>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-12 italic">
                These terms are effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
