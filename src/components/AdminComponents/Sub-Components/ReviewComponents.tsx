import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Title({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-[#64748B] text-sm font-semibold", className)}>
      {children}
    </div>
  );
}

export function Value({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("font-normal text-sm", className)}>{children}</div>;
}
