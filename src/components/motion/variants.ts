import type { Variants } from "motion/react";

/**
 * Shared Motion variants.
 *
 * Kept out of the component files so those export components only, which keeps
 * React Fast Refresh working.
 */

/** Parent variant for a card grid whose children animate in sequence. */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Child variant for a `<StaggerGroup>`. */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Opacity-only container, for subtrees that animate their own children. */
export const fadeContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};
