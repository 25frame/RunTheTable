import "./globals.css";
import { Nav } from "@/components/Nav";
import { SwipeNavigator } from "@/components/SwipeNavigator";

export const metadata = {
  title: "Run The Table",
  description: "RTT NYC",
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