"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw, Mail, MailOpen, Copy, Check } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/model/User";

// Using UIMessage type imported from MessageCard component

const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="space-y-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Profile and Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-7 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-7 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Skeleton className="h-7 w-40 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>

          <div className="h-px bg-border w-full my-4" />

          {/* Message Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const { data: session, status } = useSession();
  const username = session?.user?.username;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message: Message) => message._id !== messageId)
    );
  };

  const copyToClipboard = async () => {
    if (!profileUrl) return;

    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(profileUrl);
      setHasCopied(true);
      toast.success("Link copied to clipboard!");

      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to copy link");
    } finally {
      setIsCopying(false);
    }
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      // Ensure we have a boolean value
      setValue("acceptMessages", response.data.isAcceptingMessage!, {
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Error fetching message acceptance status:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          "Error fetching message acceptance status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      if (!username) return;

      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");

        // Transform the API response to match our UIMessage type

        setMessages(response.data.messages || []);

        if (refresh) {
          toast.success("Messages refreshed!");
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        toast.error(
          axiosError.response?.data?.message || "Failed to fetch messages"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [username]
  );

  const handleSwitchChange = async () => {
    const newValue = !acceptMessages;
    const previousValue = acceptMessages;

    // Optimistic update
    setValue("acceptMessages", newValue, { shouldValidate: true });

    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: newValue,
      });
      toast.success(response.data.message);
    } catch (error) {
      // Revert on error
      setValue("acceptMessages", previousValue, { shouldValidate: true });
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message ||
          "Failed to update message settings. Please try again."
      );
    }
  };

  // Initialize data when component mounts or session changes
  useEffect(() => {
    if (status === "authenticated") {
      // Fetch message acceptance status first
      fetchAcceptMessage();
      fetchMessages();
    }
  }, [status, fetchAcceptMessage, fetchMessages]);

  if (status === "loading" || !session) {
    return <DashboardSkeleton />;
  }

  const stats = [
    { label: "Total Messages", value: messages.length, icon: Mail },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {username}</h1>
          <p className="text-muted-foreground">
            Manage your anonymous messages and profile settings
          </p>
        </div>

        {/* Profile and Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Your Profile Link</CardTitle>
              <CardDescription>
                Share this link to receive anonymous messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-link">Your unique link</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="profile-link"
                      value={profileUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={copyToClipboard}
                            disabled={isCopying || hasCopied}
                            className="shrink-0"
                          >
                            {hasCopied ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            <span className="sr-only">Copy link</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{hasCopied ? "Copied!" : "Copy to clipboard"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    {isSwitchLoading ? (
                      <Skeleton className="h-3 w-3 rounded-full" />
                    ) : (
                      <div
                        className={`h-3 w-3 rounded-full ${
                          acceptMessages ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {isSwitchLoading ? (
                        <div className="flex items-center space-x-2 ">
                          <Skeleton className="h-4 w-36" />
                        </div>
                      ) : acceptMessages ? (
                        <span className="flex items-center">
                          {/* <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span> */}
                          Accepting messages
                        </span>
                      ) : (
                        <span className="flex items-center">
                          {/* <span className="h-2 w-2 rounded-full bg-rose-500 mr-2"></span> */}
                          Not accepting messages
                        </span>
                      )}
                    </span>
                  </div>

                  {isSwitchLoading ? (
                    <Skeleton className="h-9 w-20" />
                  ) : (
                    <Switch
                      {...register("acceptMessages")}
                      checked={acceptMessages}
                      onCheckedChange={handleSwitchChange}
                      disabled={isSwitchLoading}
                      className="data-[state=checked]:bg-green-500"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Message Statistics</CardTitle>
              <CardDescription>
                Overview of your anonymous messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg border p-4 "
                  >
                    <div className="flex justify-center items-center space-x-2">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium ml-2">
                        {stat.label}
                      </span>
                    </div>
                    <p className="mt-2 text-2xl text-center font-bold">
                      {isLoading ? "--" : stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Your Messages</h2>
              <p className="text-sm text-muted-foreground">
                {messages.length === 0
                  ? "You don't have any messages yet"
                  : `Showing ${messages.length} message${messages.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          <Separator />

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <MailOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No messages yet</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Share your profile link to start receiving anonymous messages
              </p>
              <Button
                variant="outline"
                className="mt-4"
                // asChild
                onClick={copyToClipboard}
              >
                Copy Profile Link
              </Button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <MessageCard
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
