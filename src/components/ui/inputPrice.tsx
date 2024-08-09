import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputPrice = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "number", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex text-black h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
          const input = e.target;
          // Allow only numbers and a single decimal point
          input.value = input.value.replace(/[^0-9.]/g, "");

          // Allow only one decimal point
          if ((input.value.match(/\./g) || []).length > 1) {
            input.value = input.value.slice(0, -1);
          }
        }}
        min={1}
        {...props}
      />
    );
  }
);
InputPrice.displayName = "InputPrice";

export { InputPrice };
