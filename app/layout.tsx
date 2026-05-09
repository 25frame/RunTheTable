import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ThemeRuntime } from "@/components/ThemeRuntime";

export const metadata: Metadata = {
  title: "Run The Table",
  description:
    "RTT NYC street table tennis scoring, live board, player check-in, and places to play.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-rtt-skin="default">
      <body>
        <ThemeRuntime />
        <Nav />
        {children}
      </body>
    </html>
  );
}
