import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

import { staggerItemVariants } from "./variants";
import { cn } from "@/lib/utils";

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  /** Seconds between each child. */
  gap?: number;
  amount?: number;
  as?: ElementType;
  /** Delay before the first child animates. */
  delay?: number;
};

/**
 * Parent of a card grid. Children must be a `<StaggerItem>`.
 *
 * The stagger only fires once the group scrolls into view, so a long grid does
 * not animate while it is still off screen.
 */
export function StaggerGroup({
  children,
  className,
  gap = 0.08,
  amount = 0.12,
  as = "div",
  delay = 0.05,
}: StaggerGroupProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: gap, delayChildren: delay },
    },
  };

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -6% 0px" }}
      variants={variants}
    >
      {children}
    </Component>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

/** Child of `<StaggerGroup>`. */
export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component className={cn(className)} variants={staggerItemVariants}>
      {children}
    </Component>
  );
}
