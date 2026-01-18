import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // your custom field
      role: "patient" | "doctor" | "admin"; // your custom role
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "patient" | "doctor" | "admin";
  }

  interface JWT {
    id: string;
    role: "patient" | "doctor" | "admin";
  }
}
