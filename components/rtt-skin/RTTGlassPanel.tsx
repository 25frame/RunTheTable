import { type ReactNode } from "react";

type RTTGlassPanelProps = {
  children: ReactNode;
  className?: string;
};

export function RTTGlassPanel({ children, className = "" }: RTTGlassPanelProps) {
  return <section className={`rttb-glass rttb-panel-pad ${className}`.trim()}>{children}</section>;
}
