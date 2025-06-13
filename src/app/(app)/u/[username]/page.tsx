"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, Send, Sparkles, Lock, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).filter(Boolean);
};

export default function UserProfilePage() {
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedMsg, setSuggestedMsg] = useState(
    "What's your favorite movie?||Do you have any pets?||What's your dream job?"
  );
  const [activeTab, setActiveTab] = useState("send");
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = form.watch("content");
  const { data: session } = useSession();
  const isAdmin = session?.user?._id === process.env.NEXT_PUBLIC_ADMIN_ID;

  const handleNewIdeasClick = () => {
    if (!isAdmin) {
      toast.error("This feature is only available for premium users", {
        icon: <AlertTriangle className="text-red-400" />,
        action: {
          label: "Upgrade",
          onClick: () => window.open("/pricing", "_blank"),
        },
      });

      return;
    }
    fetchSuggestedMessages();
  };

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
    // Switch to the Send Message tab
    setActiveTab("send");
    // Auto focus the textarea after selecting a message
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      toast.success(response.data.message || "Message sent successfully!");
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages");
      setSuggestedMsg(response.data.message || suggestedMsg);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load suggestions. Please try again.");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Content Tabs */}
        <Tabs
          defaultValue="send"
          className="w-full"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <div className="border-b border-gray-200 mb-8">
            <TabsList className="bg-transparent p-0 h-auto w-full justify-start space-x-6">
              <TabsTrigger
                value="send"
                className="relative cursor-pointer px-1 py-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=active]:text-primary data-[state=active]:shadow-[0_-2px_0_0_#3b82f6_inset] rounded-none"
              >
                Send Message
              </TabsTrigger>
              <TabsTrigger
                value="suggestions"
                className="relative cursor-pointer px-1 py-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=active]:text-primary data-[state=active]:shadow-[0_-2px_0_0_#3b82f6_inset] rounded-none"
              >
                Message Ideas
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="send" className="mt-0">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-5 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Send Anonymous Message
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your message will be sent anonymously to @{username}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={`What's on your mind, @${username}?`}
                              className="min-h-[150px] resize-none text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isLoading || !messageContent}
                        className="w-full cursor-pointer sm:w-auto px-6 py-3 text-base font-medium rounded-lg shadow-sm transition-colors"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Anonymously
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-0">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-5 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Message Ideas
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Click on a suggestion to use it in your message
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewIdeasClick}
                    disabled={isSuggestLoading}
                    className="shrink-0 cursor-pointer group relative"
                  >
                    Try AI
                    {isSuggestLoading ? (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    ) : isAdmin ? (
                      <Sparkles className="ml-2 h-4 w-4" />
                    ) : (
                      <Lock className="ml-2 h-4 w-4" />
                    )}
                    {!isAdmin && (
                      <span className="absolute -top-2 -right-4 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3">
                  {isSuggestLoading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-16 w-full rounded-lg"
                          />
                        ))
                    : parseStringMessages(suggestedMsg).map(
                        (message, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="h-auto cursor-pointer min-h-[64px] py-3 px-4 text-left whitespace-normal justify-start hover:bg-primary/5 hover:border-primary/30 transition-colors"
                            onClick={() => handleMessageClick(message)}
                          >
                            <span className="text-sm sm:text-base">
                              {message}
                            </span>
                          </Button>
                        )
                      )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Create Your Own Message Board
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get your own personalized link and start receiving anonymous
              messages from friends, family, or followers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="w-full cursor-pointer">
                  Get Started
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full cursor-pointer"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
