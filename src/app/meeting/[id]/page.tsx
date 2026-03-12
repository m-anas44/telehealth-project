"use client";

import { useSession } from "next-auth/react";
import {
  StreamCall,
  StreamTheme,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import MeetingRoom from "@/components/meeting/MeetingRoom";
import { useGetCallById } from "@/app/hooks/useGetCallById";

export default function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [confirmJoin, setConfirmJoin] = useState<boolean>(false);

  const { data: session } = useSession();
  const user = session?.user;
  const { id } = use(params);
  const router = useRouter();

  const { call, isCallLoading } = useGetCallById(id);

  const handleJoin = async () => {
    await call?.camera.enable();
    await call?.microphone.enable();
    await call?.join();
    setConfirmJoin(true);
  };

  if (!user) return <div>Please login to join the meeting.</div>;
  if (isCallLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!call)
    return (
      <div className="h-screen flex items-center justify-center">
        Meeting not found
      </div>
    );

  return (
    <main className="min-h-screen w-full items-center justify-center">
      <StreamCall call={call}>
        <StreamTheme>
          {confirmJoin ? (
            <MeetingRoom />
          ) : (
            <div className="flex flex-col items-center justify-center gap-5">
              <h1 className="text-3xl font-bold">Join Call</h1>
              <div className="w-full aspect-video bg-slate-800 rounded-lg overflow-hidden">
                <VideoPreview />
              </div>
              <div className="flex gap-5">
                <button
                  onClick={handleJoin}
                  className="px-4 py-3 bg-green-600 text-green-50"
                >
                  Join
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-3 bg-red-600 text-red-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}
