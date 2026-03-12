import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { StreamVideoProvider } from "./providers/StreamVideoProvider";
import AuthProvider from "./providers/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Telehealth",
  description: "Let's improve health structure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <AuthProvider>
          <StreamVideoProvider>
            <Toaster position="top-right" />
            {children}
          </StreamVideoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
