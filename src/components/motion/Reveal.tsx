import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { fadeContainerVariants } from "./variants";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "none";

export type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds of delay before the reveal begins. */
  delay?: number;
  direction?: Direction;
  /** Stagger distance in pixels. */
  distance?: number;
  duration?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "footer";
};

/**
 * Section-level scroll reveal.
 *
 * Intentionally restrained: it fades and lifts a whole block once, using a
 * viewport trigger rather than animating individual paragraphs.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 36,
  duration = 0.7,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as];

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const offset =
    direction === "up" ? { y: distance } : direction === "down" ? { y: -distance } : {};

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

/**
 * Renders children only once they have entered the viewport, then keeps them
 * mounted. Useful for animating a subtree that itself contains a scroll reveal.
 */
export function InView({
  children,
  className,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      variants={fadeContainerVariants}
    >
      {children}
    </motion.div>
  );
}
