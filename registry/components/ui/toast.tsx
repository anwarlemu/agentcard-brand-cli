"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

// The Radix toast (shadcn's older toast API; prefer Sonner for new work), drawn as the brand's toast (sonner.tsx, the
// site's .v7-toast): the white card at the bottom left with a 16 percent ink hairline, 8px corners and the toast's soft
// drop, the title in the 14px display face at 500 over its line (12px, 68 percent ink), an action as a small blue key
// and a faint close mark. `destructive` edges it in red with a red title. It slides in a few pixels from the left edge
// it lives on as it fades (260ms ease-out) and can be swiped away to the left; reduced motion keeps the fade.
const ToastProvider = ToastPrimitive.Provider;

function ToastViewport({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn("fixed bottom-0 left-0 z-50 flex max-h-dvh w-full flex-col-reverse gap-2 px-4.5 pb-5 outline-none sm:max-w-sm sm:px-7.5", className)}
      {...props}
    />
  );
}

const toastVariants = cva(
  "group/toast pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-control border border-hairline bg-surface py-3 pr-10 pl-3.5 font-sans text-fg shadow-[inset_0_1px_0_var(--ds-color-white),inset_0_-1px_0_color-mix(in_srgb,var(--ds-color-ink)_5%,transparent),0_2px_4px_color-mix(in_srgb,var(--ds-color-ink)_8%,transparent),0_12px_24px_-12px_color-mix(in_srgb,var(--ds-color-ink)_30%,transparent)] transition-[opacity,translate] duration-260 ease-out starting:-translate-x-3 starting:opacity-0 data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:duration-200 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=end]:opacity-0 data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none motion-reduce:starting:translate-x-0",
  {
    variants: {
      variant: {
        default: "",
        destructive: "border-danger [&_[data-slot=toast-title]]:text-danger",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Toast({ className, variant, ...props }: React.ComponentProps<typeof ToastPrimitive.Root> & VariantProps<typeof toastVariants>) {
  return <ToastPrimitive.Root data-slot="toast" data-variant={variant ?? "default"} className={cn(toastVariants({ variant }), className)} {...props} />;
}

function ToastAction({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "h-7 shrink-0 cursor-pointer rounded-sm border border-line-brand-edge bg-primary px-2.5 font-display text-caption text-on-primary shadow-key-brand outline-none transition-[background-color,box-shadow,translate] duration-150 ease-out hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:translate-y-px active:shadow-pressed motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

function ToastClose({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close"
      className={cn("absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-sm text-fg-faint outline-none transition-colors duration-150 ease-out hover:text-fg focus-visible:outline-2 focus-visible:outline-focus-ring motion-reduce:transition-none [&_svg]:size-3.5", className)}
      {...props}
    >
      <X strokeWidth={1.5} />
    </ToastPrimitive.Close>
  );
}

function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return <ToastPrimitive.Title data-slot="toast-title" className={cn("font-display text-body-sm leading-snug font-medium text-fg", className)} {...props} />;
}

function ToastDescription({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return <ToastPrimitive.Description data-slot="toast-description" className={cn("font-display text-caption [line-height:1.4] text-fg-muted", className)} {...props} />;
}

type ToastProps = React.ComponentProps<typeof Toast>;
type ToastActionElement = React.ReactElement<React.ComponentProps<typeof ToastAction>>;

// The toast queue: a tiny store any part of the app can push to with toast(), read by useToast() and <Toaster />.
const TOAST_LIMIT = 3;
const REMOVE_DELAY = 1000;

type ToasterToast = ToastProps & { id: string; title?: React.ReactNode; description?: React.ReactNode; action?: ToastActionElement };
type State = { toasts: ToasterToast[] };

let count = 0;
const nextId = () => String((count = (count + 1) % Number.MAX_SAFE_INTEGER));
const listeners: Array<(state: State) => void> = [];
let memory: State = { toasts: [] };
const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

function setState(update: (state: State) => State) {
  memory = update(memory);
  listeners.forEach((l) => l(memory));
}

function scheduleRemove(id: string) {
  if (timeouts.has(id)) return;
  timeouts.set(id, setTimeout(() => {
    timeouts.delete(id);
    setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  }, REMOVE_DELAY));
}

function dismiss(id?: string) {
  setState((s) => ({ toasts: s.toasts.map((t) => (id === undefined || t.id === id ? { ...t, open: false } : t)) }));
  memory.toasts.filter((t) => id === undefined || t.id === id).forEach((t) => scheduleRemove(t.id));
}

function toast(props: Omit<ToasterToast, "id">) {
  const id = nextId();
  const update = (next: Partial<ToasterToast>) => setState((s) => ({ toasts: s.toasts.map((t) => (t.id === id ? { ...t, ...next } : t)) }));
  setState((s) => ({
    toasts: [{ ...props, id, open: true, onOpenChange: (open: boolean) => { if (!open) dismiss(id); props.onOpenChange?.(open); } }, ...s.toasts].slice(0, TOAST_LIMIT),
  }));
  return { id, dismiss: () => dismiss(id), update };
}

function useToast() {
  const [state, setLocal] = React.useState(memory);
  React.useEffect(() => {
    listeners.push(setLocal);
    return () => {
      const i = listeners.indexOf(setLocal);
      if (i > -1) listeners.splice(i, 1);
    };
  }, []);
  return { ...state, toast, dismiss };
}

/** Renders the queue. Mount it once, near the root. */
function Toaster() {
  const { toasts } = useToast();
  return (
    <ToastProvider swipeDirection="left">
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid min-w-0 flex-1 gap-0.5">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export { Toast, ToastAction, ToastClose, ToastDescription, Toaster, ToastProvider, ToastTitle, ToastViewport, toast, useToast };
export type { ToastActionElement, ToastProps };
