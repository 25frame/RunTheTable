import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
export const metadata: Metadata = { title: "RTT NYC | Run The Table", description: "RTT NYC table tennis league." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><Nav />{children}</body></html>; }
