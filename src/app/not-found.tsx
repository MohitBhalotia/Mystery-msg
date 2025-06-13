'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Animated 404 Text */}
          <div className="relative">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute -bottom-2 -left-4 w-24 h-24 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -top-4 left-20 w-24 h-24 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Oops! Page Not Found
            </h2>
            
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The page you're looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Button asChild className="gap-2 group">
                <Link href="/">
                  <Home className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="gap-2 group">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>

            {/* Search and Contact Section */}
            <div className="pt-8 mt-8 border-t border-border/40">
              <p className="text-muted-foreground mb-4">Or try one of these options:</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="ghost" className="gap-2 group" asChild>
                  <Link href="/search">
                    <Search className="h-4 w-4" />
                    Search our site
                  </Link>
                </Button>
                <Button variant="ghost" className="gap-2 group" asChild>
                  <Link href="/contact">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animation styles moved to globals.css */}
      <style jsx global>{`
        /* Keyframes are now in globals.css */
      `}</style>
    </div>
  );
}
