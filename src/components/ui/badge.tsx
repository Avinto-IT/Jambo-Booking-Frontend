import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5   py-0.5 gap-0.625 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#22C55E] text-primary-foreground shadow hover:bg-[#16A34A]",
        secondary:
          "border-transparent bg-[#EAB308] text-secondary-foreground hover:bg-[#CA8A04]",
        destructive:
          "border-transparent bg-[#EF4444] text-destructive-foreground shadow hover:bg-[#DC2626]",
        outline: "text-foreground",
        Requested:
          "border-transparent bg-[#3B82F6] text-destructive-foreground shadow hover:bg-[#2563EB]",
        Pending:
          "border-transparent bg-[#EAB308] text-destructive-foreground shadow hover:bg-[#CA8A04]",
        Rejected:
          "border-transparent bg-[#EF4444] text-destructive-foreground shadow hover:bg-[#DC2626]",
        Approved:
          "border-transparent bg-[#22C55E] text-destructive-foreground shadow hover:bg-[#16A34A]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
