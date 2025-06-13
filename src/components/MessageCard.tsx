"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Trash2, AlertTriangle, X, Check, MessageSquare, Info } from "lucide-react";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message?messageId=${message._id}`
      );

      toast.success(response.data.message, {
        icon: <Check className="w-5 h-5 text-green-500" />,
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to delete message",
        {
          icon: <X className="w-5 h-5 text-red-500" />,
        }
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const formattedDate = new Date(message.createdAt).toLocaleString();
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Card
          className="relative h-[150px] flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 group"
        >
          <CardHeader className="pb-2 h-full relative">
            <div className="flex flex-col h-full">
              <div className="space-y-1 pr-10 flex-1">
                {/* Message content with optional line clamp */}
                <p className="text-base leading-relaxed break-words line-clamp-2">
                  {message.content}
                </p>
                {/* Time */}
                <p className="pl-2 text-sm font-medium text-muted-foreground">
                  <time
                    dateTime={new Date(message.createdAt).toISOString()}
                    title={formattedDate}
                  >
                    {timeAgo}
                  </time>
                </p>
              </div>
              <div className="w-full flex flex-col">

              <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-2 right-12"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 cursor-pointer px-6 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 text-xs font-medium flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMessageDialog(true);
                      }}
                      disabled={isDeleting}
                    >
                      <Info className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
              </AnimatePresence>
              
              {/* Delete Button */}
              <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-2 right-2"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-6 rounded-full cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs font-medium flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                      }}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
              </AnimatePresence>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <AlertDialogTitle>Delete Message</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2 text-left">
              Are you sure you want to delete this message? This action cannot
              be undone and the message will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex sm:space-x-2 sm:space-x-reverse">
            <AlertDialogCancel
              className="w-full mt-2 sm:mt-0 sm:w-auto"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Message Dialog */}
      <AlertDialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <AlertDialogContent className="sm:max-w-[425px] md:max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Message
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left pt-2">
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Received {timeAgo} • {formattedDate}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MessageCard;
