'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Sparkles, Shield, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { Input } from '@/components/ui/input';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const features = [
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: 'Completely Anonymous',
    description: 'Your identity stays hidden when sending messages. No tracking, no logs.',
  },
  {
    icon: <Lock className="h-6 w-6 text-primary" />,
    title: 'End-to-End Secure',
    description: 'Messages are encrypted and only visible to the intended recipient.',
  },
  {
    icon: <MessageCircle className="h-6 w-6 text-primary" />,
    title: 'Easy to Use',
    description: 'Simple and intuitive interface to send and receive anonymous messages.',
  },
];

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value.trim();
    if (username) {
      router.push(`/u/${username}`);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center ">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-20 xl:py-36 ">
        <div className="w-full px-2 md:px-6 max-w-screen-xl mx-auto">
          <div className="md:flex flex-row">
            <div className="flex flex-col justify-center space-y-4 mb-10">
              <div className="space-y-2">
                <motion.h1 
                  className="text-4xl pb-4 font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Share Your Thoughts Anonymously
                </motion.h1>
                <motion.p 
                  className="max-w-[600px] text-muted-foreground md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Connect with friends, colleagues, or followers while keeping your identity hidden. 
                  Get honest feedback and messages without revealing who you are.
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-col gap-2 min-[400px]:flex-row pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form onSubmit={handleSubmit} className="flex w-full max-w-md space-x-2">
                  <div className="relative flex-1">
                    <Input
                      ref={usernameRef}
                      className="h-12 px-4 text-base"
                      placeholder="Enter a username"
                      type="text"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12 px-6 mr-2">
                    <span>Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-4 pt-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center">
                  <Sparkles className="mr-1 h-4 w-4 text-amber-400" />
                  <span>No account needed</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div>100% Free Forever</div>
              </motion.div>
            </div>
            
            {/* Testimonials Carousel */}
            <motion.div 
              className="flex items-center justify-center mt-20 md:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full max-w-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">What people are saying</h3>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <Carousel
                  plugins={[Autoplay({ delay: 3000 })]}
                  className="w-full "
                  opts={{
                    align: 'start',
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {messages.map((message, index) => (
                      <CarouselItem key={index} >
                        <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <MessageCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{message.title}</CardTitle>
                                <CardDescription className="text-xs">{message.received}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{message.content}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Safe, Secure, and Private
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                We take your privacy seriously. Here&apos;s how we protect you.
              </p>
            </div>
          </div>
          
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to get started?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Join thousands of users who trust us for anonymous messaging.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Create Your Link Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sign-in">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}