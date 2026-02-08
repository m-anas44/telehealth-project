import { User } from "@/models/user";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/db/connectDB";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials, _) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        } else if (!credentials.role) {
          throw new Error("User role must defined");
        }
        await connectDB();
        const user = await User.findOne({
          email: credentials.email,
          role: credentials.role,
        }).select("+password");

        if (!user) {
          throw new Error("No account found with this email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "patient" | "doctor" | "admin";
        session.user.image = token.image as string;
      }
      return session;
    },
  },
};
