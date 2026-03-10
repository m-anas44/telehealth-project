"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bot, Mic, X, Volume2, Square } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { getDoctorAvailability } from "@/lib/ai/appointmentToolFunctions";

const AIAppointment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

// useEffect(() => {
//   const test = async () => {
//     console.log("--- Testing Availability ---");
//     try {
//       const response = await fetch("/api/debug", { method: "GET" });
      
//       // FIX: Data ko extract karna zaroori hai
//       const data = await response.json(); 
      
//       console.log("Response we got:- ", data); // Ab yahan slots dikhein ge
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     }
//   };
  
//   test();
// }, []);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];
          await handleVoiceResult(base64Audio, "audio/webm");
        };

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceResult = async (base64Audio: string, mimeType: string) => {
    try {
      setLoading(true);

      const { data } = await axios.post("/api/ai/voice", {
        audio: base64Audio,
        mimeType,
        history,
      });

      if (!data) {
        throw new Error("No response from server");
      }

      setAiResponse(data.text);
      setHistory(data.history);

      const utterance = new SpeechSynthesisUtterance(data.text);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Voice request error:", err);
    } finally {
      setLoading(false);
    }
  };

  const waveVariants: any = {
    idle: {
      scaleY: 1,
      transition: { duration: 0.2 },
    },
    animate: (i: number) => ({
      scaleY: [1, 2, 0.5, 1.5, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.08,
      },
    }),
  };

  return (
    <div>
      <Card className="border-2 border-[#f59e0b] bg-linear-to-r from-[#fef3c7] to-[#fde68a]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">
                  AI Voice Assistant
                </h3>
                <Badge className="bg-[#f59e0b]">Beta Live</Badge>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Book appointments using our AI voice assistant. Just speak
                naturally and let AI handle the rest!
              </p>

              <Dialog
                open={isModalOpen}
                onOpenChange={(val) => {
                  setIsModalOpen(val);
                  if (!val) window.speechSynthesis.cancel();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-white transition-colors"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Try Voice Booking
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-100 bg-slate-900 border-slate-800 text-white overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="text-center text-slate-400 font-medium">
                      {isListening ? "AI is listening..." : "Ready to talk?"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col items-center justify-center py-12">
                    {/* Animated Glow Backdrop */}
                    <div className="relative">
                      <AnimatePresence>
                        {isListening && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0.15 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                            className="absolute inset-0 bg-blue-500 rounded-full blur-3xl"
                          />
                        )}
                      </AnimatePresence>

                      {/* Main Mic Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isListening ? stopRecording : startRecording}
                        className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-colors shadow-2xl ${
                          isListening ? "bg-red-500" : "bg-blue-600"
                        }`}
                      >
                        {isListening ? (
                          <Square className="w-8 h-8 fill-white text-white" />
                        ) : (
                          <Mic className="w-10 h-10 text-white" />
                        )}
                      </motion.button>
                    </div>

                    {/* Voice Visualizer Waves */}
                    <div className="flex items-center gap-1 h-12 mt-12">
                      {[...Array(9)].map((_, i) => (
                        <motion.div
                          key={i}
                          custom={i}
                          variants={waveVariants}
                          initial="idle"
                          animate={isListening ? "animate" : "idle"}
                          className="w-1.5 bg-blue-400 rounded-full"
                          style={{
                            height:
                              i === 4 ? "32px" : i % 2 === 0 ? "16px" : "24px",
                          }}
                        />
                      ))}
                    </div>

                    <p className="mt-8 text-slate-400 text-sm text-center px-8">
                      Click the mic to send a test message to AI.
                    </p>

                    {loading && (
                      <p className="mt-4 text-blue-400 text-sm">
                        Contacting AI...
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center pb-4">
                    <Button
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="text-slate-500 hover:text-white hover:bg-slate-800"
                    >
                      End Session
                    </Button>
                    {/* AI Output Preview */}
                    {aiResponse && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center px-4"
                      >
                        <p className="text-slate-300 italic text-sm">
                          "{aiResponse}"
                        </p>
                      </motion.div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAppointment;
