import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { SwipeNavigator } from "@/components/SwipeNavigator";

export const metadata: Metadata = {
  title: "Run The Table",
  description: "RTT NYC Street Table Tennis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SwipeNavigator />
        <Nav />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}