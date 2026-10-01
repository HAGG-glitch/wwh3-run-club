import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

/**
 * WWH3 toast surface: near-square corners, dark athletic panel, gold accent.
 * Always light — the site has a single fixed (non-themeable) colour scheme.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-gold-deep" />,
        info: <InfoIcon className="size-4 text-gold-deep" />,
        warning: <TriangleAlertIcon className="size-4 text-gold-deep" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: <Loader2Icon className="size-4 animate-spin text-gold-deep" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-warm-white)",
          "--normal-text": "var(--color-ink)",
          "--normal-border": "var(--color-ink)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!rounded-sm !border-ink !bg-warm-white !font-sans !text-ink !shadow-[0_18px_40px_-18px_rgba(23,25,29,0.55)]",
          title: "!text-sm !font-bold !tracking-wide !uppercase",
          description: "!text-sm !text-muted-gray",
          actionButton:
            "!rounded-sm !bg-ink !text-warm-white !text-xs !font-bold !uppercase",
          cancelButton: "!rounded-sm !text-xs !font-bold !uppercase",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
