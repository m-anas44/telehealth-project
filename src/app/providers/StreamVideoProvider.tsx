"use client";
import { useState, ReactNode, useEffect } from "react";
import { tokenProvider } from "@/actions/stream.actions";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === "loading" || !user || !apiKey) return;
    if (!tokenProvider) return;
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id as string,
        name: user.name || user.email || "Unknown User",
        image: user.image || undefined,
      },
      tokenProvider, //👉🏻 pending creation
    });

    setVideoClient(client);
  }, [user]);

  if (!videoClient) {
    return <>{children}</>;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};
