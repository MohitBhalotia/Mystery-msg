"use client";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Message } from "@/model/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message?messageId=${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <CardDescription title={new Date(message.createdAt).toLocaleString()}>
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </CardDescription>

        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-5 h-5" />{" "}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  message and delete the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
