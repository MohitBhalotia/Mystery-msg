"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { LogOut, MessageCircle, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const user = session?.user as User;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

  // Don't show navbar on auth pages
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null;
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'border-b bg-background/90 backdrop-blur-sm shadow-sm' 
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="w-full flex h-16 items-center justify-between px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="group flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
              <MessageCircle className="relative h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              MysteryMsg
            </span>
          </Link>
        </motion.div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          
          
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <Skeleton className="h-8 w-8 rounded-full bg-gray-500"/>
            ) : session ? (
              <motion.div 
                key="authenticated"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-4"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-9 w-9 rounded-full p-0 hover:bg-accent/50"
                    >
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarImage src={user?.image || ''} alt={user?.username || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 rounded-xl p-2 shadow-lg" 
                    align="end" 
                    forceMount
                  >
                    <DropdownMenuLabel className="p-3 font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.username || user?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/dashboard" 
                        className="w-full cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground"
                      >
                        <UserIcon className="mr-2 h-4 w-4 opacity-70" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      className="px-3 py-2 rounded-md text-sm font-medium text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4 opacity-70" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <motion.div 
                key="unauthenticated"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-2"
              >
                <Button 
                  variant="ghost" 
                  asChild 
                  className="hidden sm:inline-flex"
                >
                  <Link href="/sign-in">
                    Sign In
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="hidden sm:inline-flex"
                >
                  <Link href="/sign-up">
                    Get Started
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="sm:hidden"
                  asChild
                >
                  <Link href="/sign-in" aria-label="Sign in">
                    <UserIcon className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
