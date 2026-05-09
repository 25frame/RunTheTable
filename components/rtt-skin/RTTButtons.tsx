import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function RTTPrimaryLink({ href, children, className = "" }: LinkButtonProps) {
  return (
    <Link href={href} className={`rttb-primary-cta ${className}`.trim()}>
      {children}
    </Link>
  );
}

export function RTTSecondaryLink({ href, children, className = "" }: LinkButtonProps) {
  return (
    <Link href={href} className={`rttb-secondary-cta ${className}`.trim()}>
      {children}
    </Link>
  );
}

export function RTTPrimaryButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`rttb-primary-cta ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
