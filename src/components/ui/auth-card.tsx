import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLinkText,
  className,
}: AuthCardProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.1]" />
      <Card className={cn("w-full max-w-md relative z-10 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/30 backdrop-blur-sm" />
        <div className="relative">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Image src="/favicon.svg" height={20} width={20} alt="Logo"/>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              {title}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            {children}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4 border-t border-border/40 pt-4">
            <p className="text-sm text-muted-foreground">
              {footerText}{' '}
              <Link href={footerLink} className="text-primary hover:underline font-medium">
                {footerLinkText}
              </Link>
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
