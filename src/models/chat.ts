import { Schema, Types, Model } from "mongoose";
import { ChatTypes } from "@/types/mongoTypes";
import mongoose from "mongoose";

const chatSchema = new Schema<ChatTypes>(
  {
    senderId: { type: Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
    roomId: { type: Types.ObjectId, required: true, ref: "Room" },
    type: { type: String, enum: ["text", "image", "file"], default: "text" },
  },
  { timestamps: true },
);

export const Chat: Model<ChatTypes> =
  mongoose.models.Chat || mongoose.model<ChatTypes>("Chat", chatSchema);
