import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

const variants = {
  primary: "bg-slate-950 text-white hover:bg-slate-800 focus-visible:outline-slate-950",
  secondary: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-slate-400",
  danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:outline-red-400",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
};

export function LinkButton({ className = "", href, variant = "primary", ...props }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
