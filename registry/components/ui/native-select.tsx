import * as React from "react";

import { cn } from "@/lib/utils";

// The browser's own select dressed as the brand's field (agentcard.com/get-started, .v7-gate-field select): the input's
// square box, 35 percent ink border and 18px Inter, 10px by 12px of padding, with the small ink triangle (10 by 5px)
// 13px in from the right; focus is the form's 2px blue outline laid over the border. `size="sm"` is the compact 36px
// field in the 14px face. Use it where the platform picker is better (phones, long lists, forms without script).
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "default" };

function NativeSelect({ className, size = "default", ...props }: NativeSelectProps) {
  return (
    <div data-slot="native-select-wrapper" data-size={size} className={cn("group/native-select relative w-full has-[select:disabled]:opacity-50", className)}>
      <select
        data-slot="native-select"
        data-size={size}
        className="min-h-11 w-full min-w-0 cursor-pointer appearance-none rounded-none border border-line-strong bg-surface py-2.5 pr-9 pl-3 font-sans text-h5 leading-snug text-fg outline-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-solid focus-visible:outline-focus-ring disabled:cursor-not-allowed aria-invalid:border-danger data-[size=sm]:h-9 data-[size=sm]:min-h-0 data-[size=sm]:py-0 data-[size=sm]:pl-2.5 data-[size=sm]:text-body-sm"
        {...props}
      />
      <svg aria-hidden data-slot="native-select-icon" viewBox="0 0 10 5" className="pointer-events-none absolute top-1/2 right-3.25 h-1.25 w-2.5 -translate-y-1/2 fill-current text-fg">
        <path d="M0 0h10L5 5z" />
      </svg>
    </div>
  );
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" className={cn("bg-surface text-fg", className)} {...props} />;
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return <optgroup data-slot="native-select-optgroup" className={cn("bg-surface text-fg", className)} {...props} />;
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
